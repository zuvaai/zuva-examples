#!/usr/bin/env python
# coding: utf-8

# ## Introduction
# 
# The layouts are how DocAI “sees” the document. It contains metadata about every character and page from the document.
# 
# This tutorial will cover how to request the layouts for a local PDF document, as well as parse the content in that file to see how DocAI “saw” the document.
# 
# After you have gone through this tutorial, you will be left with a working Python script that leverages multiple packages to take a layouts document. This script can be used to ingest layouts content and output the relevant data.
# 
# ### What will you learn?
# 
# The following is what you will learn by going through this tutorial:
# 
# - How to create an instance of the Python SDK to interact with DocAI
# - How to submit a document to DocAI
# - How to create an OCR request
# - How to load and iterate through the contents of a layouts file in Python
# 
# ### Requirements
# 
# To follow this tutorial, you will need:
# 
# - The Python interpreter (this tutorial uses v3.10)
# - A Zuva account and token - see the [Getting started guide](https://zuva.ai/documentation/quickstart/)
# - A copy of Zuva’s [DocAI Python SDK](https://github.com/zuvaai/zdai-python)
# - A copy of [recognition_results_pb2.py](https://github.com/zuvaai/hocr-to-eocr-converter/blob/main/recognition_results_pb2.py)
# - The `google.protobuf` Python package (this tutorial uses v3.0.0), usually installed with `pip install protobuf` or `pip3 install protobuf`
# 
# ## OCR
# For DocAI to perform classification and extractions on the documents submitted to it, it must first be able to “see” what content exists in the document. Whether it be a digital-native PDF (e.g. Word Document saved as a PDF) or a potential third-party paper in PDF format that contains a scan of a physical document, DocAI needs a method to “read” the content so that downstream processing can be performed.
# 
# Optical Character Recognition enables DocAI to achieve this. By going through every character, on every page, DocAI creates a new representation of the user-provided document. This new representation allows DocAI to have a better “understanding” of the contents provided by the user, and thus is used in DocAI’s downstream processing for all of its machine learning processes.
# 
# OCR is an optional service. However, if you would like to skip DocAI’s OCR, you will need to create your own representation using the output of your OCR engine, or provide raw text. The latter results in a partial degradation of machine learning performance due to it not containing the physical locations of where the characters exist on the page.
# 
# ## Layouts: The Overview
# 
# The layouts schema can be found [here](https://github.com/zuvaai/hocr-to-eocr-converter/blob/main/recognition_results.proto).
# 
# The basic overview is as follows:
# 
# You have a `Document`. This is the “entry-point” into the contents of the layouts.
# 
# - Each `Document` contains a list of `Characters`.
#   - Each `Character` is represented by its unicode value
#   - Each `Character` has a `BoundingBox`
# 
# - Each `Document` contains a list of `Pages`
#   - Each `Page` has the `width` (in pixels)
#   - Each `Page` has the `height` (in pixels)
#   - Each `Page` has a horizontal dots-per-inch (DPI)
#   - Each `Page` has a vertical dots-per-inch (DPI)
#   - Each `Page` has a `CharacterRange` (e.g. “characters 500 to 1000 exist on this page”)
# 
# Folks who develop applications that contain a document viewer to visualize where extractions occurred in their contracts would leverage the layouts information to map what DocAI extracted to the document/pages that the end-user (e.g. a reviewer) is shown in their solution’s document viewer.
# 
# 
# ## Let’s Build!
# 
# ### Import the necessary packages
# 
# The first step is to import the necessary Python packages in your script. Below are the packages needed by this tutorial:

# 'zdai' is the Zuva DocAI Python SDK, which provides functions
# which make it easier to use DocAI via Python.
from zdai import ZDAISDK

# 'os' to obtain the basename of the file path provided in
# variable 'local_files'
import os

# 'time' is used to wait a couple seconds between our checks
# to DocAI to see if the request has completed
import time

# 'recognition_results_pb2' is the output of Google's
# Protocol Buffer (protobuf) compiler;
# https://developers.google.com/protocol-buffers/docs/pythontutorial#compiling-your-protocol-buffers
# protoc -I=. --python_out=recognition_results.proto
# where recognition_results.proto is:
# https://github.com/zuvaai/hocr-to-eocr-converter/blob/main/recognition_results.proto
# For reference, below is the output:
# https://github.com/zuvaai/hocr-to-eocr-converter/blob/main/recognition_results_pb2.py

import recognition_results_pb2 as rr_pb2


# ### Create an instance of the SDK
# 
# 
# At this point in the tutorial you have imported the necessary Python packages. You should also have a token that was created, as mentioned in the [requirements](#requirements).

sdk = ZDAISDK(url   = 'https://us.app.zuva.ai/api/v2',
              token = os.getenv('DOCAI_TOKEN'))


# DocAI offers multiple regions to choose from, which can help you decrease latency (due to being physically closer/in the region), and data residency requirements. If you created a token on another region, provide that region’s url (e.g. `japan.app.zuva.ai`, `eu.app.zuva.ai`) instead of the one provided above (`us.app.zuva.ai`).
# 
# Going forward, the `sdk` variable is going to be used to interact with DocAI.
# 
# ### Submit document
# 
# Before we can obtain the layouts from DocAI, we will need to submit a document and run an OCR request. To upload a file, such as the demo document
# available [here](https://github.com/zuvaai/hocr-to-eocr-converter/blob/main/CANADAGOOS-F1Securiti-2152017.PDF), using the following code:

local_file = 'upload_files/CANADAGOOS-F1Securiti-2152017.PDF'

with open(local_file, 'rb') as f:
   file, _ = sdk.file.create(f.read())
   file.name = os.path.basename(local_file)


# The file variable will be used going forward to refer to the unique identifier, since DocAI has no concept of filenames. It is possible to obtain the file’s unique identifier by running `print(file.id)`.
# 
# ### Create an OCR request
# 
# This request will run an [OCR](#ocr) on the document that was [provided earlier](#submit-document). This process will create the layouts.

ocrs, _ = sdk.ocr.create(file_ids = [file.id])
ocr_request = ocrs[0]


# The `sdk` variable exposes a function named `ocr.create` which accepts a `file.id` list. One request is created per document provided. We are only running this on one document, as such `ocr_request = ocrs[0]` simply assigns the first (and only) item (request) of `ocrs` to a new variable.
# 
# ### Wait for OCR request to complete
# 
# We will need to wait for the DocAI OCR request to complete processing before we can obtain the `layouts` content. The following snippet, every two seconds, will check the request’s latest status. If it completes successfully, then load the layouts variable. This is possible by using the `sdk` function `ocr.get_layouts`, which accepts the unique ID of the request.

while not ocr_request.is_finished():
    ocr_request.update()
    print(f'{ocr_request.id} is {ocr_request.status}')

    if ocr_request.is_successful():
        layouts = sdk.ocr.get_layouts(request_id=ocr_request.id).response.content
    elif ocr_request.is_failed():
        raise Exception(f'Unable to obtain layouts.')

    time.sleep(2)


# ### Load the Layouts
# 
# By now the OCR request would have completed and the `layouts` variable contains the content needed for the next steps of this tutorial.
# 
# Using the package that we imported earlier, we can leverage `recognition_results_pb2.py` to load the `layouts` content in a way that allows us to interact with it.
# 
# Using the `Document` (entry-point), we can create a new `Document` object, and load it using the `layouts` that [DocAI provided](#wait-for-ocr-request-to-complete) to our script.

doc = rr_pb2.Document()
doc.ParseFromString(layouts)


# Going forward, the `doc` variable is what we will use to dig into the layouts.
# 
# ### Get number of pages
# The `doc.pages` contain a list of [Page](https://github.com/zuvaai/hocr-to-eocr-converter/blob/5e4b6b465c86e5f8d46a36dc557b4727cdc6efdb/recognition_results.proto#L49) objects.

print(len(doc.pages))


# ### Get number of characters
# The doc.characters contain a list of [Character](https://github.com/zuvaai/hocr-to-eocr-converter/blob/5e4b6b465c86e5f8d46a36dc557b4727cdc6efdb/recognition_results.proto#L40) objects.

print(len(doc.characters))


# ### Get the first 15 characters of document
# 
# We can use `doc.characters` to obtain the first 15 characters:

text = [c.unicode for c in doc.characters][0:15]


# The above, however, returns:

# 
#     [69, 120, 104, 105, 98, 105, 116, 32, 49, 48, 46, 49, 48, 32, 50]
# 
# 

# This is because the `Character` values are stored as unicode numbers. These can easily be converted by running the following:

text = "".join([chr(c.unicode) for c in doc.characters][0:15])


# Which returns:

# 
#     Exhibit 10.10 2
# 

# ### Get the page metadata
# 
# As mentioned earlier, each `Page` contains its own metadata. The following can be used to go through all of the layouts’ pages, and print its metadata.

for i, page in enumerate(doc.pages, 1):
    print(f'Page {i}:\n'
          f'   width       = {page.width} pixels\n'
          f'   height      = {page.height} pixels\n'
          f'   dpi_x       = {page.dpi_x}\n'
          f'   dpi_y       = {page.dpi_y}\n'
          f'   range_start = {page.range.start}\n'
          f'   range_end   = {page.range.end}\n')


# Below is a sample output for the first two pages:

# 
#     Page 1:
#     width       = 2550 pixels
#     height      = 3300 pixels
#     dpi_x       = 300
#     dpi_y       = 300
#     range_start = 0
#     range_end   = 822
# 
#     Page 2:
#     width       = 2550 pixels
#     height      = 3300 pixels
#     dpi_x       = 300
#     dpi_y       = 300
#     range_start = 822
#     range_end   = 5518
# 

# ### Get the Character metadata
# 
# Earlier, we printed out the [first handful of characters](#get-the-first-15-characters-of-document) of the layouts.
# 
# The following continues with this approach, however it also exposes additional metadata for each character. It also uses the pages data to locate on which page the characters were found.

# Go through each character and see where DocAI found each character
# in the document
def get_page_number(char_loc: int):
    for i, page in enumerate(doc.pages, 1):
        # The end and start are the same (e.g. Page 1 End = 200, and Page 2
        # Start = 200)
        # Reason: For the 'End': the range goes up-to-and-not-including 200,
        # hence < rather than <=
        if char_loc >= page.range.start and char_loc < page.range.end:
            return i
    return None

for i, character in enumerate(doc.characters[:15], 0):
    page_number = get_page_number(i)

    if not page_number:
        raise Exception(f'The character\'s location ({i}) doesn\’t fall within the range of any pages.')

    print(f'\"{chr(character.unicode)}\": '
          f'Page {page_number}: '
          f'x1={character.bounding_box.x1}, '
          f'y1={character.bounding_box.y1}, '
          f'x2={character.bounding_box.x2}, '
          f'y2={character.bounding_box.y2}')


# Running the above for the first 15 `characters` returns:

# 
#     "E": Page 1, x1=2183, y1=162, x2=2209, y2=190
#     "x": Page 1, x1=2211, y1=170, x2=2232, y2=190
#     "h": Page 1, x1=2233, y1=161, x2=2256, y2=190
#     "i": Page 1, x1=2256, y1=161, x2=2266, y2=190
#     "b": Page 1, x1=2267, y1=161, x2=2289, y2=191
#     "i": Page 1, x1=2290, y1=161, x2=2301, y2=190
#     "t": Page 1, x1=2302, y1=166, x2=2316, y2=191
#     " ": Page 1, x1=2316, y1=162, x2=2329, y2=190
#     "1": Page 1, x1=2329, y1=162, x2=2345, y2=190
#     "0": Page 1, x1=2348, y1=162, x2=2367, y2=191
#     ".": Page 1, x1=2369, y1=183, x2=2377, y2=191
#     "1": Page 1, x1=2382, y1=162, x2=2398, y2=190
#     "0": Page 1, x1=2401, y1=162, x2=2420, y2=191
#     " ": Page 1, x1=2420, y1=163, x2=2420, y2=191
#     "2": Page 1, x1=130 , y1=266, x2=149 , y2=294
# 

# The above can be interpreted as:
# 
# - The first character found on Page 1 was an `E`, located in a rectangle with top left corner at the location `(2183, 162)`, and bottom right corner located at `(2209, 190)`
