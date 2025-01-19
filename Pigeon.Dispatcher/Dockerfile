FROM golang:latest
WORKDIR /app
COPY . .
RUN go mod download
EXPOSE 6011
CMD ["go", "run", "main.go"]
