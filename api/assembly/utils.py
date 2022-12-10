import os
import time
import requests
from pytube import YouTube


ASSEMBLY_UPLOAD_ENDPOINT = 'https://api.assemblyai.com/v2/upload'
ASSEMBLY_TRANSCRIPT_ENDPOINT = 'https://api.assemblyai.com/v2/transcript'


'''
Send video to assembly for transcription
'''
def start_transcription(yt_url, webhook=None):
    start_time = time.time()
    tmp_filename = 'tmp_yt.mp4'

    # Download video audio to local file
    download_yt(yt_url, tmp_filename)
    print(f'Downloaded video in {time.time() - start_time} seconds')

    # Upload video to AssemblyAI
    upload_response = upload_file_for_transcription(tmp_filename)
    print(f'Uploaded video in {time.time() - start_time} seconds')

    # Submit video for transcription
    transcribe_response = submit_for_transcription(upload_response['upload_url'], webhook=webhook)
    return transcribe_response


'''
Get transcribed paragraphs for YouTube video
'''
def get_paragraphs_from_yt(yt_url):
    start_time = time.time()
    tmp_filename = 'tmp_yt.mp4'

    # Download video audio to local file
    download_yt(yt_url, tmp_filename)
    print(f'Downloaded video in {time.time() - start_time} seconds')

    # Upload video to AssemblyAI
    upload_response = upload_file_for_transcription(tmp_filename)
    print(f'Uploaded video in {time.time() - start_time} seconds')

    # Submit video for transcription and wait
    transcribe_response = submit_for_transcription(upload_response['upload_url'])
    completion_response = wait_for_transcription_completion(f'{ASSEMBLY_TRANSCRIPT_ENDPOINT}/{transcribe_response["id"]}')
    print(f'Transcribed video in {time.time() - start_time} seconds')

    # Get paragraphs from transcription
    paragraphs_response = get_paragraphs_from_transcript(completion_response['id'])
    print(f'Got paragraphs in {time.time() - start_time} seconds')

    paragraphs = paragraphs_response['paragraphs']
    return paragraphs


'''
Download a YouTube video as an audio file
'''
def download_yt(yt_url, filename):
    YouTube(yt_url).streams.get_audio_only().download(filename=filename)


'''
Reads a file in chunks
'''
def read_file(filename, chunk_size=5242880):
    with open(filename, 'rb') as f:
        while True:
            data = f.read(chunk_size)
            if not data:
                break

            yield data


'''
Uploads a file to AssemblyAI
'''
def upload_file_for_transcription(filename):
    headers = { 'authorization': os.environ['ASSEMBLY_API_KEY'] }

    response = requests.post(
        ASSEMBLY_UPLOAD_ENDPOINT,
        headers=headers,
        data=read_file(filename)
    )

    return response.json()


'''
Submits a file for transcription
'''
def submit_for_transcription(file_url, webhook=None):
    headers = {
        'authorization': os.environ['ASSEMBLY_API_KEY'],
        'content-type': 'application/json'
    }

    # Build request body
    json = { 'audio_url': file_url }
    if webhook:
        json['webhook_url'] = webhook

    response = requests.post(
        ASSEMBLY_TRANSCRIPT_ENDPOINT,
        headers=headers,
        json=json
    )

    return response.json()


'''
Wait for a transcription to complete
'''
def wait_for_transcription_completion(polling_endpoint):
    headers = {
        'authorization': os.environ['ASSEMBLY_API_KEY'],
        'content-type': 'application/json'
    }

    while True:
        polling_response = requests.get(
            polling_endpoint,
            headers=headers
        ).json()

        if polling_response['status'] == 'completed':
            break

        time.sleep(5)

    return polling_response


'''
Get paragraphs from a completed transcription
'''
def get_paragraphs_from_transcript(transcript_id):
    headers = { 'authorization': os.environ['ASSEMBLY_API_KEY'] }
    endpoint = f'{ASSEMBLY_TRANSCRIPT_ENDPOINT}/{transcript_id}/paragraphs'

    response = requests.get(endpoint, headers=headers)
    return response.json()
