FROM golang:latest
WORKDIR /app
COPY . .
RUN go mod download
EXPOSE 8000
CMD ["go", "run", "main.go"]
