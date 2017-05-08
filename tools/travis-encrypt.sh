#!/bin/bash

tar cvf secrets.tar .secrets/*
travis encrypt-file secrets.tar
rm secrets.tar
