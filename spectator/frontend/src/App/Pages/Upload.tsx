import React, { useState } from "react";

import { Alert, Box, Button, TextField } from "@mui/material";
import { FileUpload } from "@mui/icons-material";

type UploadProps = {
  setFile: (file: File) => void;
};

const Upload = ({ setFile }: UploadProps): JSX.Element => {
  const [error, setError] = useState("");

  const onUpload = (file: File) => {
    if (!file) return;

    setError("");

    if (file.type == "application/pdf") {
      setFile(file);
    } else {
      setError("Please upload PDF documents only.");
    }
  };

  return (
    <Box
      display="flex"
      sx={{
        flexDirection: "column",
        gap: 1,
        m: "auto",
      }}
    >
      <label
        htmlFor="upload-file"
        style={{
          display: "flex",
          gridArea: "upload",
          justifySelf: "stretch",
        }}
      >
        <input
          id="upload-file"
          accept="application/pdf"
          type="file"
          onChange={(e) => onUpload(e.target.files![0])}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          startIcon={<FileUpload sx={{ height: "20px", width: "20px" }} />}
          onClick={() => document.getElementById("upload-file")!.click()}
        >
          Upload PDF Document
        </Button>
      </label>
      {error && <Alert severity="error">error</Alert>}
    </Box>
  );
};

export default Upload;
