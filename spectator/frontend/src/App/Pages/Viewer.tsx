import React from "react";

import { Box } from "@mui/material";

import { BoundingBox, Results, Token } from "../../types";
import fields from "../../fields.json";
import { Character, CharacterRange } from "../utils/recognitionResults";

import DocumentViewer from "@zuvaai/document-viewer";

type ViewerProps = {
  file: File;
  results: Results;
  onReset: () => void;
};

const mergeBoundingBoxes = (
  token: Token | undefined,
  { boundingBox: { x1, y1, x2, y2 } }: Character
): BoundingBox => ({
  top: Math.min(token?.boundingBox.top || y1, y1),
  left: Math.min(token?.boundingBox.left || x1, x1),
  bottom: Math.max(token?.boundingBox.bottom || y2, y2),
  right: Math.max(token?.boundingBox.right || x2, x2),
});

const determineLine = (token: Token, { top, bottom }: BoundingBox) =>
  top < token?.boundingBox.bottom && bottom > token?.boundingBox.top
    ? token.line
    : token.line + 1;

const generateTokens = (
  characters: Character[],
  { start, end }: CharacterRange
): Token[] =>
  (characters || [])
    .slice(start, end)
    .reduce<(Token | undefined)[]>((tokens, character, i) => {
      if (i == 0) tokens.push(undefined);

      const token = tokens[tokens.length - 1];
      const boundingBox = mergeBoundingBoxes(token, character);

      if (character.unicode == 32) {
        if (token != undefined) tokens.push(undefined);
      } else {
        const lastToken = tokens[tokens.length - 2];
        const line = lastToken ? determineLine(lastToken, boundingBox) : 0;

        tokens[tokens.length - 1] = {
          characterStart: token?.characterStart || start + i,
          characterEnd: start + i,
          line,
          boundingBox,
        };
      }

      return tokens;
    }, [])
    .filter((item): item is Token => !!item);

const Viewer = ({ file, results, onReset }: ViewerProps): JSX.Element => {
  const annotations = results.resultsText.results
    .map((result) => {
      const topic =
        fields.find((field) => field.field_id == result.field_id)?.field_name ||
        "";

      return result.extractions.map((extraction) =>
        (extraction.spans || []).map((span) => ({
          characterStart: span.start,
          characterEnd: span.end,
          pageStart: span.pages.start,
          pageEnd: span.pages.end,
          top: span.bounds.top,
          left: span.bounds.left,
          topic,
        }))
      );
    })
    .flat(2);

  const name = file.name;

  const topics = fields.map((field) => field.field_name);

  const pages = results.layouts.pages.map((page, index) => ({
    originalHeight: page.height,
    originalWidth: page.width,
    imageURL: `${results.imageBaseUrl}/${index + 1}`,
    tokensURL: () =>
      new Promise<Token[]>((resolve) =>
        resolve(generateTokens(results.layouts.characters, page.range))
      ),
  }));

  return (
    <Box
      display="flex"
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <DocumentViewer
        id="document-viewer"
        annotations={annotations}
        name={name}
        onClose={onReset}
        pages={pages}
        topics={topics}
      />
    </Box>
  );
};

export default Viewer;
