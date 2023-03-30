/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "main";

export interface Document {
  /**
   * Required
   * Must be set to the value 3.
   */
  version: number;
  /**
   * Required
   * This must be a linearized version of the document represented
   * as characters. It should include the spaces between words
   * and paragraphs as appropriate. Spaces should be represented
   * with the unicode space character. Paragraphs only need a single
   * space between them, they don't need special treatment.
   */
  characters: Character[];
  /** Required */
  pages: Page[];
  /** Optional */
  tables: Table[];
  /** Optional */
  tableCells: TableCell[];
  /** Optional */
  fonts: Font[];
  /** Optional */
  fontSizes: FontSize[];
  /** Optional */
  fontStyles: FontStyle[];
  /** Optional */
  headers: Header[];
  /** Optional */
  footers: Footer[];
  /** Required */
  md5: Uint8Array;
}

export interface Character {
  /** The character as a UTF-16 decimal value. E.g. © is 169. */
  unicode: number;
  /** An integer between 0 and 100 where 0 means full confidence and 100 no confidence. */
  error: number;
  /** The character's bounding box on the page. */
  boundingBox: BoundingBox;
}

export interface Page {
  /** The range of characters the page covers. */
  range: CharacterRange;
  /** The width of the page in pixels. */
  width: number;
  /** The height of the page in pixels. */
  height: number;
  /** The number of horizontal pixels per inch. */
  dpiX: number;
  /** The number of vertical pixels per inch. */
  dpiY: number;
}

export interface Table {
  /** An arbitrary integer. Each table must have a unique integer identifier. */
  id: number;
  /** The page number of the page the table is on, starting from 0. */
  pageNumber: number;
}

export interface TableCell {
  /** The id of the table the cell is a part of, matches id in Table. */
  id: number;
  /** The bounding box of the cell on the page. */
  boundingBox: BoundingBox;
  /** The color of the cell. */
  backgroundColor: Color;
  /** The stroke size of the left border in pixels. */
  leftBorderWidth: number;
  /** The stroke size of the right border in pixels. */
  rightBorderWidth: number;
  /** The stroke size of the top border in pixels. */
  topBorderWidth: number;
  /** The stroke size of the bottom border in pixels. */
  bottomBorderWidth: number;
}

export interface Font {
  /** The character range that uses this font. */
  range: CharacterRange;
  /** The name of the font. */
  name: string;
  /** True if the font is a serif. */
  serif: boolean;
  /** True if the font is monospaced. */
  monospace: boolean;
}

export interface FontSize {
  /** The character range this attribute applies to. */
  range: CharacterRange;
  /** The size of the font in points. A typical point size is 11 or 12. */
  size: number;
}

export interface FontStyle {
  /** The character range this attribute applies to. */
  range: CharacterRange;
  /** The style of the text in this range. */
  style: FontStyle_Style;
}

export enum FontStyle_Style {
  BOLD = 0,
  ITALIC = 1,
  UNRECOGNIZED = -1,
}

export function fontStyle_StyleFromJSON(object: any): FontStyle_Style {
  switch (object) {
    case 0:
    case "BOLD":
      return FontStyle_Style.BOLD;
    case 1:
    case "ITALIC":
      return FontStyle_Style.ITALIC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return FontStyle_Style.UNRECOGNIZED;
  }
}

export function fontStyle_StyleToJSON(object: FontStyle_Style): string {
  switch (object) {
    case FontStyle_Style.BOLD:
      return "BOLD";
    case FontStyle_Style.ITALIC:
      return "ITALIC";
    case FontStyle_Style.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface BoundingBox {
  /**
   * The top left coordinate of the bounding box. The top left of the
   * page is considered to be 0,0.
   */
  x1: number;
  y1: number;
  /** The bottom right coordinate of the bounding box. */
  x2: number;
  y2: number;
}

export interface CharacterRange {
  start: number;
  end: number;
}

export interface Header {
  range: CharacterRange;
}

export interface Footer {
  range: CharacterRange;
}

function createBaseDocument(): Document {
  return {
    version: 0,
    characters: [],
    pages: [],
    tables: [],
    tableCells: [],
    fonts: [],
    fontSizes: [],
    fontStyles: [],
    headers: [],
    footers: [],
    md5: new Uint8Array(),
  };
}

export const Document = {
  encode(
    message: Document,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.version !== 0) {
      writer.uint32(8).int32(message.version);
    }
    for (const v of message.characters) {
      Character.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.pages) {
      Page.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.tables) {
      Table.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.tableCells) {
      TableCell.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.fonts) {
      Font.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.fontSizes) {
      FontSize.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    for (const v of message.fontStyles) {
      FontStyle.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.headers) {
      Header.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    for (const v of message.footers) {
      Footer.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    if (message.md5.length !== 0) {
      writer.uint32(146).bytes(message.md5);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Document {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDocument();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.version = reader.int32();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.characters.push(Character.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.pages.push(Page.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.tables.push(Table.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag != 42) {
            break;
          }

          message.tableCells.push(TableCell.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag != 50) {
            break;
          }

          message.fonts.push(Font.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag != 58) {
            break;
          }

          message.fontSizes.push(FontSize.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag != 66) {
            break;
          }

          message.fontStyles.push(FontStyle.decode(reader, reader.uint32()));
          continue;
        case 9:
          if (tag != 74) {
            break;
          }

          message.headers.push(Header.decode(reader, reader.uint32()));
          continue;
        case 10:
          if (tag != 82) {
            break;
          }

          message.footers.push(Footer.decode(reader, reader.uint32()));
          continue;
        case 18:
          if (tag != 146) {
            break;
          }

          message.md5 = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Document {
    return {
      version: isSet(object.version) ? Number(object.version) : 0,
      characters: Array.isArray(object?.characters)
        ? object.characters.map((e: any) => Character.fromJSON(e))
        : [],
      pages: Array.isArray(object?.pages)
        ? object.pages.map((e: any) => Page.fromJSON(e))
        : [],
      tables: Array.isArray(object?.tables)
        ? object.tables.map((e: any) => Table.fromJSON(e))
        : [],
      tableCells: Array.isArray(object?.tableCells)
        ? object.tableCells.map((e: any) => TableCell.fromJSON(e))
        : [],
      fonts: Array.isArray(object?.fonts)
        ? object.fonts.map((e: any) => Font.fromJSON(e))
        : [],
      fontSizes: Array.isArray(object?.fontSizes)
        ? object.fontSizes.map((e: any) => FontSize.fromJSON(e))
        : [],
      fontStyles: Array.isArray(object?.fontStyles)
        ? object.fontStyles.map((e: any) => FontStyle.fromJSON(e))
        : [],
      headers: Array.isArray(object?.headers)
        ? object.headers.map((e: any) => Header.fromJSON(e))
        : [],
      footers: Array.isArray(object?.footers)
        ? object.footers.map((e: any) => Footer.fromJSON(e))
        : [],
      md5: isSet(object.md5) ? bytesFromBase64(object.md5) : new Uint8Array(),
    };
  },

  toJSON(message: Document): unknown {
    const obj: any = {};
    message.version !== undefined &&
      (obj.version = Math.round(message.version));
    if (message.characters) {
      obj.characters = message.characters.map((e) =>
        e ? Character.toJSON(e) : undefined
      );
    } else {
      obj.characters = [];
    }
    if (message.pages) {
      obj.pages = message.pages.map((e) => (e ? Page.toJSON(e) : undefined));
    } else {
      obj.pages = [];
    }
    if (message.tables) {
      obj.tables = message.tables.map((e) => (e ? Table.toJSON(e) : undefined));
    } else {
      obj.tables = [];
    }
    if (message.tableCells) {
      obj.tableCells = message.tableCells.map((e) =>
        e ? TableCell.toJSON(e) : undefined
      );
    } else {
      obj.tableCells = [];
    }
    if (message.fonts) {
      obj.fonts = message.fonts.map((e) => (e ? Font.toJSON(e) : undefined));
    } else {
      obj.fonts = [];
    }
    if (message.fontSizes) {
      obj.fontSizes = message.fontSizes.map((e) =>
        e ? FontSize.toJSON(e) : undefined
      );
    } else {
      obj.fontSizes = [];
    }
    if (message.fontStyles) {
      obj.fontStyles = message.fontStyles.map((e) =>
        e ? FontStyle.toJSON(e) : undefined
      );
    } else {
      obj.fontStyles = [];
    }
    if (message.headers) {
      obj.headers = message.headers.map((e) =>
        e ? Header.toJSON(e) : undefined
      );
    } else {
      obj.headers = [];
    }
    if (message.footers) {
      obj.footers = message.footers.map((e) =>
        e ? Footer.toJSON(e) : undefined
      );
    } else {
      obj.footers = [];
    }
    message.md5 !== undefined &&
      (obj.md5 = base64FromBytes(
        message.md5 !== undefined ? message.md5 : new Uint8Array()
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<Document>, I>>(base?: I): Document {
    return Document.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Document>, I>>(object: I): Document {
    const message = createBaseDocument();
    message.version = object.version ?? 0;
    message.characters =
      object.characters?.map((e) => Character.fromPartial(e)) || [];
    message.pages = object.pages?.map((e) => Page.fromPartial(e)) || [];
    message.tables = object.tables?.map((e) => Table.fromPartial(e)) || [];
    message.tableCells =
      object.tableCells?.map((e) => TableCell.fromPartial(e)) || [];
    message.fonts = object.fonts?.map((e) => Font.fromPartial(e)) || [];
    message.fontSizes =
      object.fontSizes?.map((e) => FontSize.fromPartial(e)) || [];
    message.fontStyles =
      object.fontStyles?.map((e) => FontStyle.fromPartial(e)) || [];
    message.headers = object.headers?.map((e) => Header.fromPartial(e)) || [];
    message.footers = object.footers?.map((e) => Footer.fromPartial(e)) || [];
    message.md5 = object.md5 ?? new Uint8Array();
    return message;
  },
};

function createBaseCharacter(): Character {
  return { unicode: 0, error: 0, boundingBox: { x1: 0, y1: 0, x2: 0, y2: 0 } };
}

export const Character = {
  encode(
    message: Character,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.unicode !== 0) {
      writer.uint32(8).uint32(message.unicode);
    }
    if (message.error !== 0) {
      writer.uint32(16).uint32(message.error);
    }
    if (message.boundingBox !== undefined) {
      BoundingBox.encode(
        message.boundingBox,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Character {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCharacter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.unicode = reader.uint32();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.error = reader.uint32();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.boundingBox = BoundingBox.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Character {
    return {
      unicode: isSet(object.unicode) ? Number(object.unicode) : 0,
      error: isSet(object.error) ? Number(object.error) : 0,
      boundingBox: isSet(object.boundingBox)
        ? BoundingBox.fromJSON(object.boundingBox)
        : { x1: 0, y1: 0, x2: 0, y2: 0 },
    };
  },

  toJSON(message: Character): unknown {
    const obj: any = {};
    message.unicode !== undefined &&
      (obj.unicode = Math.round(message.unicode));
    message.error !== undefined && (obj.error = Math.round(message.error));
    message.boundingBox !== undefined &&
      (obj.boundingBox = message.boundingBox
        ? BoundingBox.toJSON(message.boundingBox)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Character>, I>>(base?: I): Character {
    return Character.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Character>, I>>(
    object: I
  ): Character {
    const message = createBaseCharacter();
    message.unicode = object.unicode ?? 0;
    message.error = object.error ?? 0;
    message.boundingBox =
      object.boundingBox !== undefined && object.boundingBox !== null
        ? BoundingBox.fromPartial(object.boundingBox)
        : { x1: 0, y1: 0, x2: 0, y2: 0 };
    return message;
  },
};

function createBasePage(): Page {
  return { range: { start: 0, end: 0 }, width: 0, height: 0, dpiX: 0, dpiY: 0 };
}

export const Page = {
  encode(message: Page, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.range !== undefined) {
      CharacterRange.encode(message.range, writer.uint32(10).fork()).ldelim();
    }
    if (message.width !== 0) {
      writer.uint32(16).uint32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(24).uint32(message.height);
    }
    if (message.dpiX !== 0) {
      writer.uint32(32).uint32(message.dpiX);
    }
    if (message.dpiY !== 0) {
      writer.uint32(40).uint32(message.dpiY);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Page {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.range = CharacterRange.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.width = reader.uint32();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.height = reader.uint32();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.dpiX = reader.uint32();
          continue;
        case 5:
          if (tag != 40) {
            break;
          }

          message.dpiY = reader.uint32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Page {
    return {
      range: isSet(object.range)
        ? CharacterRange.fromJSON(object.range)
        : { start: 0, end: 0 },
      width: isSet(object.width) ? Number(object.width) : 0,
      height: isSet(object.height) ? Number(object.height) : 0,
      dpiX: isSet(object.dpiX) ? Number(object.dpiX) : 0,
      dpiY: isSet(object.dpiY) ? Number(object.dpiY) : 0,
    };
  },

  toJSON(message: Page): unknown {
    const obj: any = {};
    message.range !== undefined &&
      (obj.range = message.range
        ? CharacterRange.toJSON(message.range)
        : undefined);
    message.width !== undefined && (obj.width = Math.round(message.width));
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.dpiX !== undefined && (obj.dpiX = Math.round(message.dpiX));
    message.dpiY !== undefined && (obj.dpiY = Math.round(message.dpiY));
    return obj;
  },

  create<I extends Exact<DeepPartial<Page>, I>>(base?: I): Page {
    return Page.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Page>, I>>(object: I): Page {
    const message = createBasePage();
    message.range =
      object.range !== undefined && object.range !== null
        ? CharacterRange.fromPartial(object.range)
        : { start: 0, end: 0 };
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    message.dpiX = object.dpiX ?? 0;
    message.dpiY = object.dpiY ?? 0;
    return message;
  },
};

function createBaseTable(): Table {
  return { id: 0, pageNumber: 0 };
}

export const Table = {
  encode(message: Table, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.pageNumber !== 0) {
      writer.uint32(16).uint32(message.pageNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Table {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTable();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.id = reader.uint32();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.pageNumber = reader.uint32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Table {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      pageNumber: isSet(object.pageNumber) ? Number(object.pageNumber) : 0,
    };
  },

  toJSON(message: Table): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.pageNumber !== undefined &&
      (obj.pageNumber = Math.round(message.pageNumber));
    return obj;
  },

  create<I extends Exact<DeepPartial<Table>, I>>(base?: I): Table {
    return Table.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Table>, I>>(object: I): Table {
    const message = createBaseTable();
    message.id = object.id ?? 0;
    message.pageNumber = object.pageNumber ?? 0;
    return message;
  },
};

function createBaseTableCell(): TableCell {
  return {
    id: 0,
    boundingBox: { x1: 0, y1: 0, x2: 0, y2: 0 },
    backgroundColor: { r: 0, g: 0, b: 0 },
    leftBorderWidth: 0,
    rightBorderWidth: 0,
    topBorderWidth: 0,
    bottomBorderWidth: 0,
  };
}

export const TableCell = {
  encode(
    message: TableCell,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.boundingBox !== undefined) {
      BoundingBox.encode(
        message.boundingBox,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.backgroundColor !== undefined) {
      Color.encode(message.backgroundColor, writer.uint32(26).fork()).ldelim();
    }
    if (message.leftBorderWidth !== 0) {
      writer.uint32(32).uint32(message.leftBorderWidth);
    }
    if (message.rightBorderWidth !== 0) {
      writer.uint32(40).uint32(message.rightBorderWidth);
    }
    if (message.topBorderWidth !== 0) {
      writer.uint32(48).uint32(message.topBorderWidth);
    }
    if (message.bottomBorderWidth !== 0) {
      writer.uint32(56).uint32(message.bottomBorderWidth);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableCell {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableCell();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.id = reader.uint32();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.boundingBox = BoundingBox.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.backgroundColor = Color.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.leftBorderWidth = reader.uint32();
          continue;
        case 5:
          if (tag != 40) {
            break;
          }

          message.rightBorderWidth = reader.uint32();
          continue;
        case 6:
          if (tag != 48) {
            break;
          }

          message.topBorderWidth = reader.uint32();
          continue;
        case 7:
          if (tag != 56) {
            break;
          }

          message.bottomBorderWidth = reader.uint32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TableCell {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      boundingBox: isSet(object.boundingBox)
        ? BoundingBox.fromJSON(object.boundingBox)
        : { x1: 0, y1: 0, x2: 0, y2: 0 },
      backgroundColor: isSet(object.backgroundColor)
        ? Color.fromJSON(object.backgroundColor)
        : { r: 0, g: 0, b: 0 },
      leftBorderWidth: isSet(object.leftBorderWidth)
        ? Number(object.leftBorderWidth)
        : 0,
      rightBorderWidth: isSet(object.rightBorderWidth)
        ? Number(object.rightBorderWidth)
        : 0,
      topBorderWidth: isSet(object.topBorderWidth)
        ? Number(object.topBorderWidth)
        : 0,
      bottomBorderWidth: isSet(object.bottomBorderWidth)
        ? Number(object.bottomBorderWidth)
        : 0,
    };
  },

  toJSON(message: TableCell): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.boundingBox !== undefined &&
      (obj.boundingBox = message.boundingBox
        ? BoundingBox.toJSON(message.boundingBox)
        : undefined);
    message.backgroundColor !== undefined &&
      (obj.backgroundColor = message.backgroundColor
        ? Color.toJSON(message.backgroundColor)
        : undefined);
    message.leftBorderWidth !== undefined &&
      (obj.leftBorderWidth = Math.round(message.leftBorderWidth));
    message.rightBorderWidth !== undefined &&
      (obj.rightBorderWidth = Math.round(message.rightBorderWidth));
    message.topBorderWidth !== undefined &&
      (obj.topBorderWidth = Math.round(message.topBorderWidth));
    message.bottomBorderWidth !== undefined &&
      (obj.bottomBorderWidth = Math.round(message.bottomBorderWidth));
    return obj;
  },

  create<I extends Exact<DeepPartial<TableCell>, I>>(base?: I): TableCell {
    return TableCell.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TableCell>, I>>(
    object: I
  ): TableCell {
    const message = createBaseTableCell();
    message.id = object.id ?? 0;
    message.boundingBox =
      object.boundingBox !== undefined && object.boundingBox !== null
        ? BoundingBox.fromPartial(object.boundingBox)
        : { x1: 0, y1: 0, x2: 0, y2: 0 };
    message.backgroundColor =
      object.backgroundColor !== undefined && object.backgroundColor !== null
        ? Color.fromPartial(object.backgroundColor)
        : { r: 0, g: 0, b: 0 };
    message.leftBorderWidth = object.leftBorderWidth ?? 0;
    message.rightBorderWidth = object.rightBorderWidth ?? 0;
    message.topBorderWidth = object.topBorderWidth ?? 0;
    message.bottomBorderWidth = object.bottomBorderWidth ?? 0;
    return message;
  },
};

function createBaseFont(): Font {
  return {
    range: { start: 0, end: 0 },
    name: "",
    serif: false,
    monospace: false,
  };
}

export const Font = {
  encode(message: Font, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.range !== undefined) {
      CharacterRange.encode(message.range, writer.uint32(10).fork()).ldelim();
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.serif === true) {
      writer.uint32(24).bool(message.serif);
    }
    if (message.monospace === true) {
      writer.uint32(32).bool(message.monospace);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Font {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFont();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.range = CharacterRange.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.serif = reader.bool();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.monospace = reader.bool();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Font {
    return {
      range: isSet(object.range)
        ? CharacterRange.fromJSON(object.range)
        : { start: 0, end: 0 },
      name: isSet(object.name) ? String(object.name) : "",
      serif: isSet(object.serif) ? Boolean(object.serif) : false,
      monospace: isSet(object.monospace) ? Boolean(object.monospace) : false,
    };
  },

  toJSON(message: Font): unknown {
    const obj: any = {};
    message.range !== undefined &&
      (obj.range = message.range
        ? CharacterRange.toJSON(message.range)
        : undefined);
    message.name !== undefined && (obj.name = message.name);
    message.serif !== undefined && (obj.serif = message.serif);
    message.monospace !== undefined && (obj.monospace = message.monospace);
    return obj;
  },

  create<I extends Exact<DeepPartial<Font>, I>>(base?: I): Font {
    return Font.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Font>, I>>(object: I): Font {
    const message = createBaseFont();
    message.range =
      object.range !== undefined && object.range !== null
        ? CharacterRange.fromPartial(object.range)
        : { start: 0, end: 0 };
    message.name = object.name ?? "";
    message.serif = object.serif ?? false;
    message.monospace = object.monospace ?? false;
    return message;
  },
};

function createBaseFontSize(): FontSize {
  return { range: { start: 0, end: 0 }, size: 0 };
}

export const FontSize = {
  encode(
    message: FontSize,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.range !== undefined) {
      CharacterRange.encode(message.range, writer.uint32(10).fork()).ldelim();
    }
    if (message.size !== 0) {
      writer.uint32(16).uint32(message.size);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FontSize {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFontSize();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.range = CharacterRange.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.size = reader.uint32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FontSize {
    return {
      range: isSet(object.range)
        ? CharacterRange.fromJSON(object.range)
        : { start: 0, end: 0 },
      size: isSet(object.size) ? Number(object.size) : 0,
    };
  },

  toJSON(message: FontSize): unknown {
    const obj: any = {};
    message.range !== undefined &&
      (obj.range = message.range
        ? CharacterRange.toJSON(message.range)
        : undefined);
    message.size !== undefined && (obj.size = Math.round(message.size));
    return obj;
  },

  create<I extends Exact<DeepPartial<FontSize>, I>>(base?: I): FontSize {
    return FontSize.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FontSize>, I>>(object: I): FontSize {
    const message = createBaseFontSize();
    message.range =
      object.range !== undefined && object.range !== null
        ? CharacterRange.fromPartial(object.range)
        : { start: 0, end: 0 };
    message.size = object.size ?? 0;
    return message;
  },
};

function createBaseFontStyle(): FontStyle {
  return { range: { start: 0, end: 0 }, style: 0 };
}

export const FontStyle = {
  encode(
    message: FontStyle,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.range !== undefined) {
      CharacterRange.encode(message.range, writer.uint32(10).fork()).ldelim();
    }
    if (message.style !== 0) {
      writer.uint32(16).int32(message.style);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FontStyle {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFontStyle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.range = CharacterRange.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.style = reader.int32() as any;
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FontStyle {
    return {
      range: isSet(object.range)
        ? CharacterRange.fromJSON(object.range)
        : { start: 0, end: 0 },
      style: isSet(object.style) ? fontStyle_StyleFromJSON(object.style) : 0,
    };
  },

  toJSON(message: FontStyle): unknown {
    const obj: any = {};
    message.range !== undefined &&
      (obj.range = message.range
        ? CharacterRange.toJSON(message.range)
        : undefined);
    message.style !== undefined &&
      (obj.style = fontStyle_StyleToJSON(message.style));
    return obj;
  },

  create<I extends Exact<DeepPartial<FontStyle>, I>>(base?: I): FontStyle {
    return FontStyle.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FontStyle>, I>>(
    object: I
  ): FontStyle {
    const message = createBaseFontStyle();
    message.range =
      object.range !== undefined && object.range !== null
        ? CharacterRange.fromPartial(object.range)
        : { start: 0, end: 0 };
    message.style = object.style ?? 0;
    return message;
  },
};

function createBaseColor(): Color {
  return { r: 0, g: 0, b: 0 };
}

export const Color = {
  encode(message: Color, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.r !== 0) {
      writer.uint32(8).uint32(message.r);
    }
    if (message.g !== 0) {
      writer.uint32(16).uint32(message.g);
    }
    if (message.b !== 0) {
      writer.uint32(24).uint32(message.b);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Color {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseColor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.r = reader.uint32();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.g = reader.uint32();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.b = reader.uint32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Color {
    return {
      r: isSet(object.r) ? Number(object.r) : 0,
      g: isSet(object.g) ? Number(object.g) : 0,
      b: isSet(object.b) ? Number(object.b) : 0,
    };
  },

  toJSON(message: Color): unknown {
    const obj: any = {};
    message.r !== undefined && (obj.r = Math.round(message.r));
    message.g !== undefined && (obj.g = Math.round(message.g));
    message.b !== undefined && (obj.b = Math.round(message.b));
    return obj;
  },

  create<I extends Exact<DeepPartial<Color>, I>>(base?: I): Color {
    return Color.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Color>, I>>(object: I): Color {
    const message = createBaseColor();
    message.r = object.r ?? 0;
    message.g = object.g ?? 0;
    message.b = object.b ?? 0;
    return message;
  },
};

function createBaseBoundingBox(): BoundingBox {
  return { x1: 0, y1: 0, x2: 0, y2: 0 };
}

export const BoundingBox = {
  encode(
    message: BoundingBox,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.x1 !== 0) {
      writer.uint32(8).uint32(message.x1);
    }
    if (message.y1 !== 0) {
      writer.uint32(16).uint32(message.y1);
    }
    if (message.x2 !== 0) {
      writer.uint32(24).uint32(message.x2);
    }
    if (message.y2 !== 0) {
      writer.uint32(32).uint32(message.y2);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BoundingBox {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBoundingBox();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.x1 = reader.uint32();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.y1 = reader.uint32();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.x2 = reader.uint32();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.y2 = reader.uint32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BoundingBox {
    return {
      x1: isSet(object.x1) ? Number(object.x1) : 0,
      y1: isSet(object.y1) ? Number(object.y1) : 0,
      x2: isSet(object.x2) ? Number(object.x2) : 0,
      y2: isSet(object.y2) ? Number(object.y2) : 0,
    };
  },

  toJSON(message: BoundingBox): unknown {
    const obj: any = {};
    message.x1 !== undefined && (obj.x1 = Math.round(message.x1));
    message.y1 !== undefined && (obj.y1 = Math.round(message.y1));
    message.x2 !== undefined && (obj.x2 = Math.round(message.x2));
    message.y2 !== undefined && (obj.y2 = Math.round(message.y2));
    return obj;
  },

  create<I extends Exact<DeepPartial<BoundingBox>, I>>(base?: I): BoundingBox {
    return BoundingBox.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BoundingBox>, I>>(
    object: I
  ): BoundingBox {
    const message = createBaseBoundingBox();
    message.x1 = object.x1 ?? 0;
    message.y1 = object.y1 ?? 0;
    message.x2 = object.x2 ?? 0;
    message.y2 = object.y2 ?? 0;
    return message;
  },
};

function createBaseCharacterRange(): CharacterRange {
  return { start: 0, end: 0 };
}

export const CharacterRange = {
  encode(
    message: CharacterRange,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.start !== 0) {
      writer.uint32(8).uint32(message.start);
    }
    if (message.end !== 0) {
      writer.uint32(16).uint32(message.end);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CharacterRange {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCharacterRange();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.start = reader.uint32();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.end = reader.uint32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CharacterRange {
    return {
      start: isSet(object.start) ? Number(object.start) : 0,
      end: isSet(object.end) ? Number(object.end) : 0,
    };
  },

  toJSON(message: CharacterRange): unknown {
    const obj: any = {};
    message.start !== undefined && (obj.start = Math.round(message.start));
    message.end !== undefined && (obj.end = Math.round(message.end));
    return obj;
  },

  create<I extends Exact<DeepPartial<CharacterRange>, I>>(
    base?: I
  ): CharacterRange {
    return CharacterRange.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CharacterRange>, I>>(
    object: I
  ): CharacterRange {
    const message = createBaseCharacterRange();
    message.start = object.start ?? 0;
    message.end = object.end ?? 0;
    return message;
  },
};

function createBaseHeader(): Header {
  return { range: { start: 0, end: 0 } };
}

export const Header = {
  encode(
    message: Header,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.range !== undefined) {
      CharacterRange.encode(message.range, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Header {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeader();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.range = CharacterRange.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Header {
    return {
      range: isSet(object.range)
        ? CharacterRange.fromJSON(object.range)
        : { start: 0, end: 0 },
    };
  },

  toJSON(message: Header): unknown {
    const obj: any = {};
    message.range !== undefined &&
      (obj.range = message.range
        ? CharacterRange.toJSON(message.range)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Header>, I>>(base?: I): Header {
    return Header.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Header>, I>>(object: I): Header {
    const message = createBaseHeader();
    message.range =
      object.range !== undefined && object.range !== null
        ? CharacterRange.fromPartial(object.range)
        : { start: 0, end: 0 };
    return message;
  },
};

function createBaseFooter(): Footer {
  return { range: { start: 0, end: 0 } };
}

export const Footer = {
  encode(
    message: Footer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.range !== undefined) {
      CharacterRange.encode(message.range, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Footer {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFooter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.range = CharacterRange.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Footer {
    return {
      range: isSet(object.range)
        ? CharacterRange.fromJSON(object.range)
        : { start: 0, end: 0 },
    };
  },

  toJSON(message: Footer): unknown {
    const obj: any = {};
    message.range !== undefined &&
      (obj.range = message.range
        ? CharacterRange.toJSON(message.range)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Footer>, I>>(base?: I): Footer {
    return Footer.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Footer>, I>>(object: I): Footer {
    const message = createBaseFooter();
    message.range =
      object.range !== undefined && object.range !== null
        ? CharacterRange.fromPartial(object.range)
        : { start: 0, end: 0 };
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
