## Introduction

This document contains a step-by-step tutorial on how to leverage DocAI to obtain key metadata from your documents, as well as how this metadata can be saved to a spreadsheet for ease-of-reading.

After you have gone through this tutorial, you will be left with a working Python script that leverages multiple packages to take documents from your local folder, use machine learning (via DocAI) to extract and classify key metadata and save the content in a spreadsheet. Best of all, you will be able to explain what each component of the script does!

## What will you learn?

The following is what you will learn by going through this tutorial:

- How to create an instance of the Python SDK to interact with DocAI
- How to submit your documents to DocAI
- How to create Language, Classification, and Field Extraction requests
- How to select fields from DocAI’s readily-available out-of-the-box fields
- How to output the data DocAI provides into an easy-to-read spreadsheet

## Requirements

To go through this tutorial, you will need:

- The Python interpreter (this tutorial uses v3.10)
- A Zuva account and token - see the [Getting started guide](https://zuva.ai/documentation/quickstart/)
- A copy of Zuva’s [DocAI Python SDK](https://github.com/zuvaai/zdai-python)

## Let’s Build!

### Import the necessary packages

The first step is to import the necessary Python packages in your script. Below are the packages needed by this tutorial:


```python
# 'pandas' is used to take what we have obtained from DocAI
# and save it in a format that we want in a spreadsheet
import pandas as pd

# 'time' is used to wait a couple seconds between our checks
# to DocAI to see if the request has completed
import time

# 'os' is used to get the files that exist in our file uploads
# folder. We will use this to join directory paths to file names
# and also determine if the path provided is a file (or not).
import os

# 'zdai' is the Zuva DocAI Python SDK, which provides functions
# which make it easier to use DocAI via Python.
# We are importing ZDAISDK (Zuva DocAI Software Development Kit)
# which is the entry point to DocAI's services.
# The other packages are the request types that we are going to
# create as part of this tutorial.
from zdai import ZDAISDK, DocumentClassificationRequest, \
   LanguageClassificationRequest, FieldExtractionRequest
```

### Get the files

Before you can run DocAI’s ML on your document, you will need to submit it (or them) to DocAI first. Below is how you can provide a folder name (upload_files, in this case) pointing to a folder that contains documents.


```python
upload_files_directory = 'upload_files'

docs = [os.path.join(upload_files_directory, f) for f
       in os.listdir(upload_files_directory)
       if os.path.isfile(os.path.join(upload_files_directory, f))
       and not f.startswith('.')]
```

Going forward, docs contain the file path and file name of all of the underlying files. An example of this is: `upload_files/mydocument.pdf`.

To verify the contents of docs, you can run `print([d for d in docs])`. While this tutorial uses local files, the same workflow would be followed for remote-hosted files. The only difference would be using the remote solution’s functionality to obtain the file’s content over the network.

## Create an instance of the SDK

At this point in the tutorial you have imported the necessary Python packages, as well as loaded the documents that will be sent to DocAI. You should also have a token that was created, as mentioned in the requirements.


```python
sdk = ZDAISDK(url   = 'https://us.app.zuva.ai/api/v2',
              token = os.getenv('DOCAI_TOKEN'))
```

DocAI offers multiple regions to choose from, which can help you decrease latency (due to being physically closer/in the region), and data residency requirements. If you created a token on another region, provide that region’s url (e.g. japan.app.zuva.ai, eu.app.zuva.ai) instead of the one provided above (us.app.zuva.ai).

Going forward, the `sdk` variable is going to be used to interact with DocAI.

### Get the DocAI Fields

All DocAI users can utilize the Zuva-maintained AI model catalog in their workflow. These AI models are known as Fields in DocAI: they are used to extract entities, provisions and clauses from legal documents. DocAI is able to extract text written in a non-standard way (i.e. non-templated), which results in an offering that searches based on the AI’s understanding of legal concepts, as opposed to traditional regular expressions and database searches.


```python
fields, _ = sdk.fields.get()
print(f'Found {len(fields)} fields on region {sdk.url}')
```

The `fields` variable contains a reference to all of the Fields available to you. When run, the above will print how many fields were found on the region that you used when creating an instance of the Python SDK.


### Submit your documents to DocAI

Submitting documents to DocAI is the first step towards obtaining metadata out of the document. Note that DocAI will not use the documents submitted to it for training purposes. These submitted documents are treated as confidential and are not used by Zuva for anything.

You can submit your documents to DocAI for analysis by running the following:


```python
docai_files = []

for doc in docs:
    with open(doc, 'rb') as f:
        file, _ = sdk.file.create(content=f.read())
        file.name = os.path.basename(doc)
        docai_files.append(file)
        print(f'Submitted "{file.name}" to DocAI. '
              f'DocAI sees this file as "{file.id}", and will be deleted on {file.expiration}.')
```

The above will go through all of your documents (from your docs variable) and submit the document to DocAI. This is done by using a function that the sdk exposes: `file.create`, which takes the file content (in this case, `f.read()`). The DocAI response is assigned to a variable named `file`, which contains properties that can be used by you to keep track of this document.

The three properties used above are: `file.name` (set locally to make it easier to keep track), `file.id` (the file’s unique identifier) and `file.expiration` (when it will be deleted).

These files are loaded in `docai_files`, which will be used in the next steps to create requests in DocAI.

### Create requests in DocAI

All requests in this script will be added to a variable named `requests`:


```python
requests = []
```

Every request contains a unique identifier, which will be used further in this tutorial to keep track of the request’s status. Once the request completes processing, we can then obtain the results. In other words: DocAI performs requests asynchronously. When you create a request, DocAI will automatically perform OCR (if needed) behind the scenes without requiring the user to explicitly call the OCR service.

### Language Classification

This service will tell you the dominant language of the document. The following creates the requests. One request is created per document provided. The following provides a `file_id` list to the Language Classification service by using the sdk function `language.create`.


```python

languages, _ = sdk.language.create(file_ids = [d.id for d in docai_files])
```

### Document Classification

This service will tell you the document’s type (e.g. Real Estate Agreement). It will also tell you if it is a contract or not. The following creates the requests. One request is created per document provided. The following provides a `file_id` list to the Document Classification service by using the `sdk` function `classification.create`.


```python

classifications, _ = sdk.classification.create(file_ids = [d.id for d in docai_files])
```

### Field Extraction

This service will extract the fields you have chosen to be extracted from your document. It will return the text (which can be multiple words, sentences or paragraphs), as well as where it was found in the document.

### Choosing the fields

By now you have a variable named `fields` that contain ~1300+ field references. You can filter these using the field names that you would like to use. Below is the list of field names that this tutorial will extract out of your documents, as well as how their unique identifiers (used by the Field Extraction service) are retrieved.


```python
field_names = ['Title', 'Parties', 'Date',
              'Governing Law', 'Indemnity',
              'Termination for Cause or Breach', 'Termination for Insolvency',
              'Termination for Convenience', '“Confidential Information” Definition']

field_ids = [f.id for f in fields if f.name in field_names]
```

The `field_ids` variable now contains a `field_id` that represents the fields defined in `field_names`.

### Using the fields

Now that you have both a list of documents and a list of field identifiers, you can use the sdk function `extraction.create`, and provide these two lists to it.


```python

extractions, _ = sdk.extraction.create(file_ids = [d.id for d in docai_files], field_ids = field_ids)
```

One field extraction request is created per document in `docai_files`. Each request will be responsible to search the document for the fields from `field_ids`.

#### Combine the requests in one list

You now have three variables that contain numerous requests each. These variables are `languages`, `classifications` and `extractions`.

#### Combine all of these to the requests variable:


```python
requests.extend(classifications + languages + extractions)
```

#### Wait until all requests complete

When a request is created, DocAI’s workers will pick them up and process them. Since this tutorial will obtain the DocAI output and save them to a spreadsheet, we will need to form a data structure that allows us to organize DocAI’s results in a manner that makes it easy for us to retrieve them when it’s time to save them.

Thus, the following snippet performs two key things:

- Every two seconds, it checks all of the requests to see if they have completed.
- When a request completes, its metadata is added to the `results` variable, which will be used later in this tutorial. In addition, the request is removed from the list since it is no longer needed.


```python
results = {}

while len(requests) > 0:
    for request in requests:
        print(request.type, request.id, request.status)
        request.update()
        if request.is_finished():
            requests.remove(request)
            if not request.is_successful():
                print(f'{request.id} failed.')
                continue

            # Creates the data structure for the file_id if it doesn't already exist
            if request.file_id not in results:
                results[request.file_id] = {}
                results[request.file_id]['name'] = [d.name for d in docai_files
                                                    if d.id == request.file_id][0]

            if request.is_type(DocumentClassificationRequest):
                results[request.file_id]['type'] = request.classification
                results[request.file_id]['is_contract'] = 'Yes' if request.is_contract else 'No'

            elif request.is_type(LanguageClassificationRequest):
                results[request.file_id]['language'] = request.language

            elif request.is_type(FieldExtractionRequest):
                results[request.file_id]['extractions'] = []

                for result in request.get_results():
                    field_name = [f.name for f in fields if f.id == result.field_id][0]

                    for span in result.spans:
                        results[request.file_id]['extractions'].append({
                            'field_name': field_name,
                            'page_start': span.page_start,
                            'page_end': span.page_end,
                            'text': result.text
                        })
    time.sleep(2)
```

This snippet leverages numerous `sdk` functions to achieve this task (also known as “polling” the requests until they complete):

- `.update()` is used to obtain the request’s latest status.
- `.get_results()` is used by Field Extraction requests to obtain all of the extracted text (and their locations).
There is a separate function to obtain the Field Extraction results because the response varies in size (few-to-many results, depending on file size and number of fields requested), compared to the other services which are always going to contain a fixed number of data points.
- `.is_type()` is used since the requests variable contains multiple different types of requests (language, document classification, field extraction)
- `.is_finished()` to check if the request completed processing
- `.is_successful()` to check if the request completed successfully

#### Data Structure

This data structure was defined for this tutorial, and has no bearing on how DocAI performs its tasks. The structure exists to collate DocAI results to their respective `file_id`. This data in practice will likely be saved in a database, from where the results can be obtained. However, for this tutorial, we are setting this in-memory.

```json
{
 "name": "Document.pdf" ,
 "type": "Employment-Related Agt" ,
 "is_contract": "Yes" ,
 "language": "English" ,
 "extractions": [
   {
     "field_name": "Termination for Cause or Breach" ,
     "page_start": 1 ,
     "page_end": 1 ,
     "text": "(iv) Any material breach of Articles IV, V, VI or VII, below of this Agreement by Employee;"
   } ,
   {
     "field_name": "Termination for Cause or Breach" ,
     "page_start": 1 ,
     "page_end": 1 ,
     "text": "(ii) any purported termination of the Employee\u2019s employment for Cause wh..."
   } ,
   {
     "field_name": "Termination for Cause or Breach" ,
     "page_start": 2 ,
     "page_end": 2 ,
     "text": "provided, however, that no termination shall be for Good ..."
   } ,
   {
     "field_name": "Termination for Cause or Breach" ,
     "page_start": 5 ,
     "page_end": 5 ,
     "text": "8.6 Effect of Breach. In the even..."
   } ,
   {
     "field_name": "Governing Law" ,
     "page_start": 5 ,
     "page_end": 5 ,
     "text": "State of Wisconsin"
   }
 ]
}
```


### Save as a Spreadsheet

Using the organized data, we can now save it in a format that is easy to share with others.

First, we need to define the spreadsheet’s columns:


```python

df_columns = [
    'Filename',
    'Language',
    'Document Type',
    'Contract?',
    'Field Name',
    'Page',
    'Text'
]
```

Second, we’ll need to go through the organized data and set it up for intake by a third-party package (in this case, pandas) so that our metadata maps to the columns above.


```python
data = []

for file_id, metadata in results.items():
    filename = metadata.get('name')
    language = metadata.get('language')
    document_type = metadata.get('type')
    is_contract = metadata.get('is_contract')
    for extraction in metadata.get('extractions'):
        data.append([filename, language, document_type, is_contract,
                     extraction.get('field_name'),
                     extraction.get('page'),
                     extraction.get('text')])
```

Using the new data variable, create a `DataFrame`:


```python
df = pd.DataFrame(data, columns=df_columns)
```

And then save it as a spreadsheet:


```python
df.to_excel('output.xlsx')
```
