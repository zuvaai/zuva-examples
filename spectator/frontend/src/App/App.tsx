import React, { useState } from "react";

import Loading from "./Pages/Loading";
import Upload from "./Pages/Upload";
import Viewer from "./Pages/Viewer";

import { Results } from "../types";

const App = (): JSX.Element => {
  const [file, setFile] = useState<File>();
  const [results, setResults] = useState<Results>();

  const onReset = () => {
    setResults(undefined);
    setFile(undefined);
  };

  return results && file ? (
    <Viewer file={file} results={results} onReset={onReset} />
  ) : file ? (
    <Loading file={file} onReset={onReset} setResults={setResults} />
  ) : (
    <Upload setFile={setFile} />
  );
};

export default App;
