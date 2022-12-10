import os
import json
import cohere
import pinecone
from tqdm import tqdm
from fastapi import FastAPI
from pydantic import BaseModel
from pytube import YouTube

#changes to check if CICD works

app = FastAPI()

co = cohere.Client(api_key=os.environ['COHERE_API_KEY'])

pinecone.init(api_key=os.environ['PINECONE_TEXT_API_KEY'])
paragraphs_index = pinecone.Index('paragraphs')


class TranscribeRequest(BaseModel):
    video_url: str
    video_id: str

@app.post('/transcribe')
def transcribe(request: TranscribeRequest):
    video_url = request.video_url

    # Get video info from youtube
    yt = YouTube(video_url)
    video_title = yt.title
    video_thumbnail = yt.thumbnail_url

    # Get transcription
    print(f'Transcribing {video_url}...')
    with open('paragraphs.json', 'r') as f:
        transcription = json.loads(f.read())

    paragraphs = transcription['paragraphs']
    paragraph_texts = [p['text'] for p in paragraphs]

    # Get paragraph embeddings
    print('Getting paragraph embeddings...')
    cohere_response = co.embed(paragraph_texts, model='large')
    paragraph_embeddings = cohere_response.embeddings

    # Upload embeddings to pinecone
    print(f'Uploading {len(paragraph_embeddings)} embeddings to pinecone...')
    data = []
    for i, embedding in tqdm(enumerate(paragraph_embeddings)):
        data.append((
            f'{request.video_id}_{i}',
            embedding,
            {
                'video_id': request.video_id,
                'paragraph_id': i,
                'text': paragraph_texts[i],
            }
        ))

        if len(data) == 32 or i == (len(paragraph_embeddings) - 1):
            paragraphs_index.upsert(data)
            data = []

    response = {
        'video_title': video_title,
        'video_thumbnail': video_thumbnail,
        'transcription': transcription,
    }

    return response


class QueryRequest(BaseModel):
    query: str

@app.post('/query')
def post_query(request: QueryRequest):
    # Embed query
    cohere_response = co.embed([request.query], model='large')
    query_embedding = cohere_response.embeddings[0]

    # Query pinecone
    query_results = paragraphs_index.query(
        query_embedding,
        top_k=5,
        include_metadata=True)['matches']

    # Construct response
    response_items = []
    for entry in query_results:
        response_items.append({
            'score': entry['score'],
            'video_id': entry.metadata['video_id'],
            'paragraph_id': entry.metadata['paragraph_id'],
            'text': entry.metadata['text'],
        })

    return response_items