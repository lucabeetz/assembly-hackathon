FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir -r /code/requirements.txt

COPY ./assembly /code/assembly

COPY ./setup.py /code/setup.py

RUN pip install .

CMD ["uvicorn", "assembly.main:app", "--host", "0.0.0.0", "--port", "80"]