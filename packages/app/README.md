# use-twilio

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dist/src/main
```

This project was created using `bun init` in bun v1.1.27. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


# How to run and test the project
## setup the ngrok server
### run the ngrok server by running the following command
```bash
ngrok http 8080
```
### copy the forwarding address and paste it in the .env file
```bash
e.g. https://bbf0-240b-11-18e1-6000-2c04-cea1-da27-158e.ngrok-free.app
```

```env
TWILIO_WEBHOOK_URL= ${ngrok forwarding address}
```
## run the server
```bash
bun run start:dev
```

## execute the call request
```bash
curl -X POST http://localhost:8080/calls/initiate \
  -H "Content-Type: application/json" \
  -d '{"to": "+81XXXXXXXXXX", "type": "CREATED"}'
```
