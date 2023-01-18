## Introduction

Zuva DocAI provides over 1300 built-in fields designed to cover many different use cases. However, if you need to develop your own fields, you have two options:

- [AI Trainer](https://zuva.ai/ai-trainer/): Provides a no-code solution to training new fields for use in DocAI. Simply upload your documents, highlight your annotations, and click train. 

- DocAI training API: Provides low level access to Zuva's field-training functionality, suitable for integration into a custom document viewer or automated workflows. 

This tutorial will walk you through the process of training a new field using the API via the DocAI Python SDK.

### What will you learn

In this tutorial, you will learn to:
- Submit training documents
- Provide example annotations
- Create a new Zuva field
- Train the field
- Get Metadata about the field
- Test the field

## Requirements

For this tutorial, you will need:

- The Python interpreter (this tutorial uses v3.10)
- A Zuva account and token - see the [Getting started guide](https://zuva.ai/documentation/quickstart/)
- A copy of Zuva’s [DocAI Python SDK](https://github.com/zuvaai/zdai-python)


## Let’s Build!

### Import the necessary packages

The first step is to import the necessary Python packages in your script. Below are the packages needed by this tutorial:


```python
# 'zdai' is the Zuva DocAI Python SDK, which provides functions
# which make it easier to use DocAI via Python.
from zdai import ZDAISDK

# 'os' to obtain the basename of the file path provided in
# variable 'local_files'
import os

# 'time' is used to wait a couple seconds between our checks
# to DocAI to see if the request has completed
import time

# 'json' is used to encode the training API request body
import json

# 'csv' is used to parse the training data file
import csv

# 'fuzzysearch' is used to locate annotation text within Zuva's
# OCRed representation of the documents
import fuzzysearch
```

### Create an instance of the SDK

At this point in the tutorial you have imported the necessary Python packages. You should also have a token, as mentioned in the [requirements](#requirements).

Create an `sdk` instance in the region you will be using. For example, for the United States region and with your token exported as an environment variable called `DOCAI_TOKEN`:


```python
sdk = ZDAISDK(url   = 'https://us.app.zuva.ai/api/v2',
              token = os.getenv('DOCAI_TOKEN'))
```

Going forward, the `sdk` variable is going to be used to interact with DocAI.


### Gather Training Documents

To train a field, you will first need to upload your training documents to DocAI. These documents should be representative of the types of documents you'd like to use your field to analyze in the future. For example, if you'd like to train your field to extract a particular clause from English-language employment contracts in Ontario, you should include only English employment contracts from Ontario in the training set. If you would like the field to work across multiple jurisdictions or document types, you should try to gather a wider variety of examples.

For this tutorial, we'll use a CSV file (`training_examples.csv`) to specify which files to upload for training and the annotations to be used as training examples. The files themselves are expected to be located in the local `upload_files` subdirectory.


```python
training_examples = []

with open ('training_examples.csv') as csvfile:
    inputreader = csv.reader(csvfile, dialect="excel")
    for row in inputreader:
        training_examples.append({"file_name": row[0], "annotations": row[1]})
```


### Submit your documents to DocAI

Submitting documents to DocAI is the first step towards training a field. Note that only you will be able to train fields using your documents; Zuva will never use your documents to train any other fields. These submitted documents are treated as confidential and are not used by Zuva for anything.

For this tutorial, we will upload all of the files specified in the training set:


```python
upload_files_directory = 'upload_files'

for example in training_examples:
    filename = example['file_name']
    with open(os.path.join(upload_files_directory, filename), 'rb') as file:
        f, _ = sdk.file.create(content=file.read())
        example['file_id'] = f.id
        print(f'Submitted "{filename}" to DocAI. '
              f'File ID: "{f.id}"')
```

The above will go through the list of training files and upload each to DocAI, storing the file IDs for later reference. It is important to keep track of the file ID corresponding to each file, since DocAI only has the file content, not the file names.

### OCR your documents

Prior to training your fields, you will process them using the [DocAI OCR service](http://localhost:1313/documentation/services/using-ocr/).

Start by creating an OCR request for each file:


```python
for example in training_examples:
    ocr_requests, _ = sdk.ocr.create(file_ids=[example['file_id']])
    example['ocr_request'] = ocr_requests[0]
```

Then, use a polling loop to check that all of the requests complete successfully.


```python
ocr_waiting = [example['ocr_request'] for example in training_examples]

while len(ocr_waiting) > 0:
    for request in ocr_waiting:
        print(request.type, request.id, request.status)
        request.update()
        if request.is_finished():
            ocr_waiting.remove(request)
            if not request.is_successful():
                print(f'{request.id} failed.')
                continue

            print(f'{request.id} succeeded.')
    time.sleep(5)
```

At this point, each file has been OCRed and has a corresponding `complete` OCR request that we can use to annotate the document.

### Provide annotation locations

To train a model, DocAI needs to know the location of the target text to be extracted from each document. 

These locations must be given in terms of Zuva's internal representation of the document, which can be obtained from the OCR text, layouts or eOCR.

For example, if you are building your own document viewer, you would retrieve the documents layouts (see the [layouts tutorial](https://zuva.ai/documentation/tutorials/using-layouts/)) and images, and use them in a viewer such as [specatator](https://github.com/zuvaai/spectator).

In our case, we have already loaded the highlight text from the `training_examples.csv` file, so we just have to figure out where those text strings are located within Zuva's OCRed version of the document. Since there may be small discrepencies between our search string and Zuva's OCRed version of the document, we'll use a fuzzy search to find the string within the OCR text. 


```python
# L_DIST sets the "fuzziness" of the search, defined as the maximum Levenshtein distance for a
# substring of the document to count as a match with the target string
L_DIST = 5

annotations_dict = {}

for example in training_examples:
    file_id = example['file_id']
    
    if example['annotations'] == "":
        print(example['file_name'], "no annotations")
        annotations_dict[file_id] = []
        continue
    text = example['ocr_request'].get_text()

    matches = fuzzysearch.find_near_matches(example['annotations'], text, max_l_dist=L_DIST)
    start = matches[0].start
    end = matches[0].end
        
    print(example['file_name'], start, end)


    if file_id not in annotations_dict:
        annotations_dict[file_id] = []
    annotations_dict[file_id].append({'start': start, 'end': end})

# 'annotations' will hold the annotations structure required by the API
annotations = []
for file_id, locations in annotations_dict.items():
    annotations.append({'file_id': file_id, 'locations': locations})
```

The `annotations` object now contains all of the information DocAI will need in order to train a field.

### Create and train the field

Since we're training a brand new field, we first have to create it:


```python
field_id, _ = sdk.fields.create(field_name="Tutorial field")

print("Field ID: " + field_id)
```

It is also possible to train an existing custom field, or to create a new custom field as a copy of an existing one (by providing `from_field_id` as an argument).

### Training the field

Now, we can create a new training request and use a polling loop to wait for it to complete. 


```python
field_training_request, _ = sdk.fields.train(field_id=field_id, annotations=json.dumps(annotations))

print("Field training request ID:", field_training_request.id)

while not field_training_request.is_finished():
    field_training_request.update()
    print(field_training_request.status)
    time.sleep(5)
```

### Getting Field accuracy

Once the field is trained, we can obtain a summary of its performance as follows:


```python
accuracy, _ = sdk.fields.get_accuracy(field_id=field_id)
print(f"Precision: {accuracy.precision}")
print(f"Recall: {accuracy.recall}")
print(f"F-score: {accuracy.f_score}")
print(f"Examples: {accuracy.example_count}")

```

Let's break down what exactly these scores mean.

#### Precision

The precision of a model measures its ability to return only the target extractions. It is defined as `P = (True Positives) / (True Positives + False Positives)`  - i.e. the proportion of results which are correct. Higher is better, with an ideal score of 1.

### Recall

The recall of a model measures its ability to return all target extractions. It is defined as `R = (True Positives) / (True Positives + False Negatives)` = i.e. the proportion of target extractions which were actually found. Higher is better, with an ideal score of 1.

### F-Score

Neither of the two measures above present a complete measure of model performance. A model with excellent precision may omit many valid results, while a model with excellent recall may include a large number of false negatives. The F-score is a standard metric for overall model performance taking into account both precision and accuracy, defined as `F = 2 * (P * R) / (P + R)`. Higher is better, with an ideal score of 1.

### Example count

The example count is simply the total number of documents the model was trained on.


## Getting Field Metadata

We can also retrieve metadata about custom fields, including the file IDs of files it has been trained on


```python

metadata, _ = sdk.fields.get_metadata(field_id=field_id)
print("Name:", metadata.name)
print("Description:", metadata.description)
print("Trained files:")
print("\n".join([f" - {id}" for id in metadata.file_ids]))
```

## Field validation details

Another way to look at the results of training is to get the field validation details - a list of everything the model extracted (or was supposed to extract).

To obtain the field validation details, 


```python
validation_details, _ = sdk.fields.get_validation_details(field_id=field_id)

for vd in validation_details:
    print(vd.file_id, vd.type, vd.location.character_start, vd.location.character_end)
```

Which should give output like the following:

    cf6345k2nt5g1d87cklg fn 26952 27310
    cf6345k2nt5g1d87ckng fn 55089 55719
    cf6345s2nt5g1d87ckpg fn 20640 20983
    cf6345s2nt5g1d87ckrg fn 10715 11058
    cf6346c2nt5g1d87cktg fn 11710 11911
    cf6347s2nt5g1d87cl00 fn 34476 34777
    cf6347s2nt5g1d87cl20 fn 74754 74904
    cf634842nt5g1d87cl40 fn 17342 17685
    cf634842nt5g1d87cl60 fn 18666 19049
    cf634842nt5g1d87cl80 fn 12613 12781
    cf6348c2nt5g1d87cla0 tp 8090 8293
    cf6348s2nt5g1d87cle0 tp 30551 30799
    cf634942nt5g1d87clhg tp 10460 10662
    cf634942nt5g1d87cljg tp 27436 27455
    cf634942nt5g1d87cllg tp 21460 21673
    cf6349c2nt5g1d87clo0 tp 55652 55996
    cf6349c2nt5g1d87clq0 tp 12085 12428
    cf6349k2nt5g1d87cls0 tp 37731 37979
    cf6349k2nt5g1d87clu0 tp 34957 35236
    cf6349k2nt5g1d87cm00 tp 13292 13513

Note that the first ten entries always appear as "False negatives", since they are used to train the initial model and are never used for validation. From the eleventh onwards, we should start to see a mix of the following:

### TP (true positive)

The field successfully extracted the example.

### FN (false negative)

The field failed to extract the example. This could mean that the example is too disimilar from other previous examples, which might mean it was erroneously included in the training set. In this case the character location refers to the example that should have been found.

### FP (false positive)

The field extracted something that wasn't provided as an example. This can be interpreted as a "suggestion" of an annotation that should have been made but wasn't. In this case the character location refers to the location of the annotation found by the AI model.

### Testing the field

Now that the field is trained, we can try using it to extract a new document. As usual, we start by uploading the file and creating the extraction request, specifying the field id of our newly trained field.


```python
filename = "NATURADEIN-8KUnschedu-892005.pdf"
with open(os.path.join(upload_files_directory, filename), 'rb') as file:
    f, _ = sdk.file.create(content=file.read())
    file_id = f.id

[extraction_request], _ = sdk.extraction.create([file_id], [field_id])
```

Then, we poll for completion of the request:


```python
while not extraction_request.is_finished():
    extraction_request.update()
    print(f'{extraction_request.id} is {extraction_request.status}')

    if extraction_request.is_successful():
        results = extraction_request.get_results()
    elif extraction_request.is_failed():
        raise Exception(f'Unable to obtain layouts.')

    time.sleep(2)

for result in results:
    print(result.text)
```

The result should be the following text:

    (i) Further Assurances. The parties agree to execute such additional documents and perform such acts as are reasonably necessary to effectuate the intent of this Agreement.

Congratulations on training your field! It is now ready to use on real documents as part of your DocAI workflows.
