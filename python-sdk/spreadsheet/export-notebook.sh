##!/bin/sh

# These commands export the jupyter notebook to markdown and python.

jupyter nbconvert spreadsheet.ipynb --to markdown
jupyter nbconvert --no-prompt --to script --stdout spreadsheet.ipynb > spreadsheet.py