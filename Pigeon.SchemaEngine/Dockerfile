FROM python:latest
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 6000
CMD ["fastapi" , "run" , "main.py" , "--port","6000"]
