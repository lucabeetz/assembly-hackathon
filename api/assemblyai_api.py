import time
import requests
import os
from pytube import YouTube


# assembly ai parameters
api_key = os.environ['AAI_API_KEY']
transcript_endpoint = 'https://api.assemblyai.com/v2/transcript'
upload_endpoint = 'https://api.assemblyai.com/v2/upload'
paragraphs_endpoint = lambda transcript_id: f'{transcript_endpoint}/{transcript_id}/paragraphs'

header_auth_only = {
    'authorization': api_key
}

header = {
    'authorization': api_key,
    'content-type': 'application/json'
}

def download_yt(yt_url, filename):
    YouTube(yt_url).streams.get_audio_only().download(filename=filename)


def upload_file(filename):
    def read_file(filename, chunk_size=5242880):
        with open(filename, 'rb') as _file:
            while True:
                data = _file.read(chunk_size)
                if not data:
                    break
                yield data

    return requests.post(upload_endpoint,
                            headers=header_auth_only,
                            data=read_file(filename)).json()
                            
def transcribe_file(file_url):
    json = { 
        "audio_url": file_url,
    }
    response = requests.post(transcript_endpoint, json=json, headers=header)
    return response.json()

def wait_for_completion(polling_endpoint):
    while True:
        polling_response = requests.get(polling_endpoint, headers=header)
        polling_response = polling_response.json()

        if polling_response['status'] == 'completed':
            break

        time.sleep(5)
    return polling_response

def get_paragraphs_for_transcript(transcript_id):
    endpoint = f'https://api.assemblyai.com/v2/transcript/{transcript_id}/paragraphs'

    paragraphs = requests.get(endpoint, headers=header_auth_only)
    return paragraphs.json()

def get_paragraphs_from_yt(yt_url):
    start_time = time.time_ns()
    tmp_filename = 'tmp_yt.mp4'

    download_yt(yt_url, tmp_filename)
    yt_time = time.time_ns()
    print(f'Downloaded in {yt_time - start_time} ns')

    upload_response = upload_file(tmp_filename)
    upload_time = time.time_ns()
    print(f'Uploaded in {upload_time - yt_time} ns')

    transcribe_response = transcribe_file(upload_response['upload_url'])
    finished_response = wait_for_completion(f'{transcript_endpoint}/{transcribe_response["id"]}')
    transcribe_time = time.time_ns()
    print(f'Transcribed in {transcribe_time - upload_time} ns')

    paragraphs = get_paragraphs_for_transcript(finished_response['id'])
    para_time = time.time_ns()
    print(f'Got paragraphs in {para_time - transcribe_time} ns')

    os.remove(tmp_filename)
    return paragraphs
