#!/bin/bash

cd .secrets
openssl aes-256-cbc -K $encrypted_c8009c8e5377_key -iv $encrypted_c8009c8e5377_iv -in secrets.tar.enc -out secrets.tar -d
tar xvf secrets.tar
rm secrets.tar.enc
rm secrets.tar
