FROM python:latest
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["fastapi" , "run" , "main.py" , "--port","5000"]