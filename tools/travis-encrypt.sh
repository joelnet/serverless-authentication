#!/bin/bash

cd .secrets
tar cvf secrets.tar *.key
travis encrypt-file secrets.tar
rm secrets.tar
