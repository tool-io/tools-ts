import { toolResourceLimits } from "./limits.js";

export class CsvParseError extends Error {
  readonly code: string;
  constructor(
    message: string,
    code = "invalid_csv",
  ) {
    super(message);
    this.name = "CsvParseError";
    this.code = code;
  }
}

export const csvDelimiters = [",", ";", "\t", "|"] as const;

export type CsvDocument = {
  readonly header?: readonly string[];
  readonly rows: readonly (readonly string[])[];
};

export type CsvParseOptions = {
  readonly delimiter?: string;
  readonly hasHeader?: boolean;
};

type CsvParserState = {
  readonly delimiter: string;
  field: string;
  fields: string[];
  inQuotes: boolean;
  rows: string[][];
};

const endField = (state: CsvParserState): void => {
  state.fields.push(state.field);
  state.field = "";
};

const endRow = (state: CsvParserState): void => {
  endField(state);
  // A record holding a single empty field represents a blank line.
  if (!(state.fields.length === 1 && state.fields[0] === ""))
    state.rows.push(state.fields);
  state.fields = [];
};

/** Parses RFC 4180 CSV text into records. Blank lines are skipped. */
export const parseCsv = (
  text: string,
  options: CsvParseOptions = {},
): CsvDocument => {
  if (typeof text !== "string")
    throw new CsvParseError("CSV input must be text.");
  if (text.length > toolResourceLimits.textCharacters)
    throw new CsvParseError(
      `CSV input must not exceed ${toolResourceLimits.textCharacters.toLocaleString("en-US")} characters.`,
      "resource_limit_exceeded",
    );
  const delimiter = options.delimiter ?? ",";
  if (typeof delimiter !== "string" || delimiter.length !== 1)
    throw new CsvParseError("The delimiter must be a single character.");
  const state: CsvParserState = {
    delimiter,
    field: "",
    fields: [],
    inQuotes: false,
    rows: [],
  };
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]!;
    if (state.inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          state.field += '"';
          index += 1;
        } else state.inQuotes = false;
      } else state.field += character;
      continue;
    }
    if (
      character === '"' &&
      state.field === ""
    )
      state.inQuotes = true;
    else if (character === delimiter) endField(state);
    else if (character === "\r" || character === "\n") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      endRow(state);
    } else state.field += character;
  }
  if (state.inQuotes)
    throw new CsvParseError("A quoted CSV field is not terminated.");
  if (state.field !== "" || state.fields.length > 0) endRow(state);
  const cells = state.rows.reduce((sum, row) => sum + row.length, 0);
  if (cells > toolResourceLimits.generatedValues)
    throw new CsvParseError(
      `CSV input must not exceed ${toolResourceLimits.generatedValues.toLocaleString("en-US")} cells.`,
      "resource_limit_exceeded",
    );
  return options.hasHeader
    ? { header: state.rows[0], rows: state.rows.slice(1) }
    : { rows: state.rows };
};
