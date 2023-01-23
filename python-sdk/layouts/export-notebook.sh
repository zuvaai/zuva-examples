##!/bin/sh

# These commands export the jupyter notebook to markdown and python.

jupyter nbconvert layouts.ipynb --to markdown
jupyter nbconvert --no-prompt --to script --stdout layouts.ipynb > layouts.py