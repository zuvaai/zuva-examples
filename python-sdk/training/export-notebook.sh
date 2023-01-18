##!/bin/sh

# These commands export the jupyter notebook to markdown and python.

jupyter nbconvert training.ipynb --to markdown
jupyter nbconvert --no-prompt --to script --stdout training.ipynb > training.py