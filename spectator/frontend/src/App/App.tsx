import React, { useState } from "react";

import Loading from "./Pages/Loading";
import Upload from "./Pages/Upload";
import Viewer from "./Pages/Viewer";

import { ExtractionResults } from "../types";
import { Document } from "./utils/recognitionResults";

const App = (): JSX.Element => {
  const [file, setFile] = useState<File>();
  const [resultsText, setResultsText] = useState<ExtractionResults>();
  const [imageBaseUrl, setImageBaseUrl] = useState<string>();
  const [layouts, setLayouts] = useState<Document>();

  const onReset = () => {
    setResultsText(undefined);
    setImageBaseUrl(undefined);
    setLayouts(undefined);
    setFile(undefined);
  };

  return resultsText && imageBaseUrl && layouts && file ? (
    <Viewer
      file={file}
      resultsText={resultsText}
      imageBaseUrl={imageBaseUrl}
      layouts={layouts}
      onReset={onReset}
    />
  ) : file ? (
    <Loading
      file={file}
      onReset={onReset}
      setResultsText={setResultsText}
      setImageBaseUrl={setImageBaseUrl}
      setLayouts={setLayouts}
    />
  ) : (
    <Upload setFile={setFile} />
  );
};

export default App;
