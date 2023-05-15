export type BoundingBox = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type Span = {
  bounds: BoundingBox;
  bboxes: {
    page: number;
    bounds: BoundingBox[];
  }[];
  end: number;
  pages: {
    end: number;
    start: number;
  };
  start: number;
};

export type ExtractionResults = {
  file_id: string;
  request_id: string;
  results: {
    extractions: {
      spans?: Span[];
      text: string;
      defined_term?: {
        term: string;
        spans: Span[];
      };
    }[];
    field_id: string;
  }[];
};

export type Token = {
  line: number;
  boundingBox: BoundingBox;
  characterStart: number;
  characterEnd: number;
};
