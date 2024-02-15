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
