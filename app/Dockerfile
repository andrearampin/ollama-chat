FROM python:3.13-rc-slim

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]