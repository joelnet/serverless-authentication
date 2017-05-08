#!/bin/bash

openssl aes-256-cbc -K $encrypted_3d599e52b404_key -iv $encrypted_3d599e52b404_iv -in ../.secrets/public.key.enc -out ../.secrets/public.key2 -d
openssl aes-256-cbc -K $encrypted_3d599e52b404_key -iv $encrypted_3d599e52b404_iv -in ../.secrets/private.key.enc -out ../.secrets/private.key2 -d
npm install --production
npm run deploy:dev
