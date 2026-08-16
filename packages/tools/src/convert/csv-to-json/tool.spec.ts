import { describe, expect, it } from "vitest";
import { calculateCsvToJson, csvToJsonExample, runCsvToJson } from "./tool.js";

describe("CSV to JSON converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCsvToJson(csvToJsonExample.input)).toEqual({
      ok: true,
      output: csvToJsonExample.output,
    });
  });

  it("handles quoted commas, escaped quotes, and embedded newlines", () => {
    const output = calculateCsvToJson({
      csv: 'text,speech\n"say ""hi""","line1\nline2"\n',
    });
    expect(output.json).toBe(
      '[{"text":"say \\"hi\\"","speech":"line1\\nline2"}]',
    );
  });

  it("supports alternate delimiters and pretty printing", () => {
    const output = calculateCsvToJson({
      csv: "a;b\n1;2",
      delimiter: ";",
      indent: 2,
    });
    expect(output.json).toBe(
      '[\n  {\n    "a": 1,\n    "b": 2\n  }\n]',
    );
  });

  it("emits arrays when the first row is not a header", () => {
    const output = calculateCsvToJson({
      csv: "Ada,36",
      hasHeader: false,
    });
    expect(output.json).toBe('[["Ada",36]]');
  });

  it("keeps raw strings when inference is disabled", () => {
    const output = calculateCsvToJson({
      csv: "n\n12.5\n",
      inferNumbers: false,
    });
    expect(output.json).toBe('[{"n":"12.5"}]');
  });

  it("surfaces parser and structure errors through execution", () => {
    expect(runCsvToJson({ csv: '"open' })).toMatchObject({
      error: { issues: [{ code: "invalid_csv" }] },
      ok: false,
    });
    expect(
      runCsvToJson({ csv: "a,a\n1,2" }),
    ).toMatchObject({
      error: { issues: [{ code: "duplicate_header" }] },
      ok: false,
    });
    expect(
      runCsvToJson({ csv: "a,b\n1" }),
    ).toMatchObject({
      error: { issues: [{ code: "inconsistent_row_count" }] },
      ok: false,
    });
    expect(runCsvToJson({ csv: "" }).ok).toBe(false);
  });
});
