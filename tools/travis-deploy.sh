openssl aes-256-cbc -K $encrypted_3d599e52b404_key -iv $encrypted_3d599e52b404_iv -in ../.secret/private.key.enc -out ../.secret/private.key -d
openssl aes-256-cbc -K $encrypted_3d599e52b404_key -iv $encrypted_3d599e52b404_iv -in ../.secret/public.key.enc -out ../.secret/public.key -d
npm install --production
npm run deploy:dev