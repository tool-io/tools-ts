import { describe, expect, it } from "vitest";
import { calculateJsonToCsv, jsonToCsvExample, runJsonToCsv } from "./tool.js";

describe("convert/json-to-csv", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJsonToCsv(jsonToCsvExample.input)).toEqual({
      ok: true,
      output: jsonToCsvExample.output,
    });
  });

  it("collects columns in first-appearance order and pads missing cells", () => {
    expect(calculateJsonToCsv({ json: '[{"a":1},{"c":true,"a":2}]' })).toEqual({
      csv: "a,c\n1,\n2,true\n",
    });
  });

  it("quotes cells containing delimiters, quotes, or newlines", () => {
    expect(
      calculateJsonToCsv({ json: '[{"t":"a,b"},{"t":"say \\"hi\\""}]' }),
    ).toEqual({ csv: 't\n"a,b"\n"say ""hi"""\n' });
  });

  it("serializes nested values as compact JSON with quote escaping", () => {
    expect(calculateJsonToCsv({ json: '[{"v":{"x":[1]}}]' })).toEqual({
      csv: 'v\n"{""x"":[1]}"\n',
    });
  });

  it("supports alternate delimiters and headerless output", () => {
    expect(
      calculateJsonToCsv({
        delimiter: ";",
        hasHeader: false,
        json: '[{"a":1,"b":2}]',
      }),
    ).toEqual({ csv: "1;2\n" });
  });

  it("rejects non-arrays, empty arrays, and non-object rows", () => {
    expect(runJsonToCsv({ json: "{}" }).ok).toBe(false);
    expect(runJsonToCsv({ json: "[]" }).ok).toBe(false);
    expect(runJsonToCsv({ json: "[1]" }).ok).toBe(false);
    const malformed = runJsonToCsv({ json: "{" });
    expect(malformed.ok).toBe(false);
    if (malformed.ok) return;
    expect(malformed.error.issues[0]?.code).toBe("malformed_json");
  });
});
