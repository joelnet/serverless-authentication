#!/bin/bash

openssl aes-256-cbc -K $encrypted_3d599e52b404_key -iv $encrypted_3d599e52b404_iv -in secrets.tar.enc -out secrets.tar -d
tar xvf secrets.tar
rm secrets.tar.enc
rm secrets.tar
