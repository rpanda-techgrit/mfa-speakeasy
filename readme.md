# MFA-Speakeasy setup

### Install

```bash
> npm install
```

### Run

```bash
> npm run start
```

## Usage

Setup:

```curl
curl --location --request POST 'localhost:3000/api/setup'
```

Note: The response needs to be converted from base64 to image to render the QR code.

Verify:

```curl
curl --location 'localhost:3000/api/verify' \
--header 'Content-Type: application/json' \
--data '{
    "secret": "FYSWO6DLGI2F4PTBPBIFWTSEFFKTI6KL",
    "token": "628453"
}'
```

## Docker

### Build

```bash
docker build --build-arg NODE_ENV=<ENV_NAME> -t mfa-speakeasy:<ENV_NAME> .
```

For eg. `docker build --build-arg NODE_ENV=production -t mfa-speakeasy:production .`

### Run

```bash
docker run -d -p 3000:3000 mfa-speakeasy:<ENV_NAME>
```

For eg. `docker run -d -p 3000:3000 mfa-speakeasy:production`
