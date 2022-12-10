import os
import json
import cohere
import pinecone
from tqdm import tqdm
from fastapi import FastAPI
from pydantic import BaseModel
from pytube import YouTube


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