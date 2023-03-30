import { Document } from "./App/utils/recognitionResults";

export type BoundingBox = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type BBox = {
  page: number;
  bounds: BoundingBox[];
};

type Span = {
  bounds: BoundingBox;
  bboxes: BBox[];
  end: number;
  pages: {
    end: number;
    start: number;
  };
  start: number;
};

type DefinedTerm = {
  term: string;
  spans: Span[];
};

type Extraction = {
  spans?: Span[];
  text: string;
  defined_term: DefinedTerm;
};

type ExtractionResult = {
  extractions: Extraction[];
  field_id: string;
};

export type ExtractionResults = {
  file_id: string;
  request_id: string;
  results: ExtractionResult[];
};

export type Results = {
  resultsText: ExtractionResults;
  imageBaseUrl: string;
  layouts: Document;
};

export type Token = {
  line: number;
  boundingBox: BoundingBox;
  characterStart: number;
  characterEnd: number;
};
