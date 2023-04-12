import React, { useEffect, useState } from "react";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Check, Refresh } from "@mui/icons-material";

import { Results } from "../../types";
import fields from "../../fields.json";
import { Document } from "../utils/recognitionResults";

const BASE_URL = "http://localhost:3001";
const FIELD_IDS = fields.map((f) => f.field_id);

type LoadingProps = {
  file: File;
  onReset: () => void;
  setResults: (results: Results) => void;
};

const Loading = ({ file, onReset, setResults }: LoadingProps): JSX.Element => {
  const [filesLoading, setFilesLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [extractionLoading, setExtractionLoading] = useState(false);

  const [fileId, setFileId] = useState("");
  const [resultsText, setResultsText] = useState();
  const [imageBaseUrl, setImageBaseUrl] = useState<string>();
  const [layouts, setLayouts] = useState<Document>();

  useEffect(() => {
    const controller = new AbortController();

    const postFiles = async () => {
      setFilesLoading(true);
      const response = await fetch(`${BASE_URL}/files`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/pdf",
        },
        signal: controller.signal,
        body: file,
      });
      const json = await response.json();
      setFileId(json.file_id);
      setFilesLoading(false);
    };

    postFiles();

    return () => {
      controller.abort();
    };
  }, [file]);

  useEffect(() => {
    if (!fileId) return;

    const controller = new AbortController();

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const getRequestStatus = async (url: string, status: string) => {
      let statusText = status;
      while (statusText == "processing" || statusText == "queued") {
        statusText = await new Promise((resolve, reject) => {
          setTimeout(
            async () =>
              fetch(url, {
                method: "GET",
                headers,
                signal: controller.signal,
              })
                .then((response) => response.json())
                .then((json: { status: string }) => resolve(json.status))
                .catch(reject),
            2000
          );
        });
      }
    };

    const processRequest = async (url: string, body: string) => {
      const postResp = await fetch(url, {
        method: "POST",
        headers,
        signal: controller.signal,
        body,
      });
      const postJson = await postResp.json();
      const { request_id, status } = postJson.file_ids[0];

      await getRequestStatus(`${url}/${request_id}`, status);
      return request_id;
    };

    const processExtraction = async () => {
      setExtractionLoading(true);

      const requestId = await processRequest(
        `${BASE_URL}/extraction`,
        JSON.stringify({ file_ids: [fileId], field_ids: FIELD_IDS })
      );

      const resultsTextResponse = await fetch(
        `${BASE_URL}/extraction/${requestId}/results/text`,
        { method: "GET", headers, signal: controller.signal }
      );

      setResultsText(await resultsTextResponse.json());

      setExtractionLoading(false);
    };

    const processOcr = async () => {
      setOcrLoading(true);

      const requestId = await processRequest(
        `${BASE_URL}/ocr`,
        JSON.stringify({ file_ids: [fileId] })
      );

      setImageBaseUrl(`${BASE_URL}/ocr/${requestId}/images`);

      const layoutsResponse = await fetch(
        `${BASE_URL}/ocr/${requestId}/layouts`,
        { method: "GET", headers, signal: controller.signal }
      );
      const arrayBuffer = await layoutsResponse.arrayBuffer();

      setLayouts(Document.decode(new Uint8Array(arrayBuffer)));

      setOcrLoading(false);
    };

    processExtraction();
    processOcr();

    return () => {
      controller.abort();
    };
  }, [fileId]);

  useEffect(() => {
    if (!resultsText || !imageBaseUrl || !layouts) return;

    setResults({
      resultsText,
      imageBaseUrl,
      layouts,
    });
  }, [resultsText, imageBaseUrl, layouts]);

  return (
    <Box
      display="flex"
      sx={{
        flexDirection: "column",
        gap: 1,
        m: "auto",
      }}
    >
      <Box
        display="grid"
        sx={{
          flexDirection: "column",
          gridTemplateColumns: "1fr auto",
          gap: 2,
          m: "auto",
        }}
      >
        <Typography>Upload File</Typography>
        {filesLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Check color="success" />
        )}
        <Typography>Process OCR</Typography>
        {filesLoading || ocrLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Check color="success" />
        )}
        <Typography>Process Extraction</Typography>
        {filesLoading || extractionLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Check color="success" />
        )}
        <Button
          variant="contained"
          startIcon={<Refresh sx={{ height: "20px", width: "20px" }} />}
          onClick={onReset}
          sx={{ gridColumn: "1/-1" }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Loading;
