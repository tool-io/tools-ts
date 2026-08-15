import { describe, expect, it } from "vitest";
import { CsvParseError, parseCsv } from "./csv.js";

describe("core CSV parser", () => {
  it("splits records on commas, CRLF, LF, and CR", () => {
    expect(parseCsv("a,b\nc,d")).toEqual({ rows: [["a", "b"], ["c", "d"]] });
    expect(parseCsv("a,b\r\nc,d\r\n")).toEqual({
      rows: [["a", "b"], ["c", "d"]],
    });
    expect(parseCsv("a\rb")).toEqual({ rows: [["a"], ["b"]] });
  });

  it("supports quoted fields with embedded delimiters, quotes, and newlines", () => {
    const document = parseCsv('x,y\n"say ""hi""",1\n"multi\nline",2', {
      hasHeader: true,
    });
    expect(document.header).toEqual(["x", "y"]);
    expect(document.rows).toEqual([
      ['say "hi"', "1"],
      ["multi\nline", "2"],
    ]);
  });

  it("treats doubled quotes inside quoted fields literally", () => {
    expect(parseCsv('"a""b"')).toEqual({ rows: [["a\"b"]] });
  });

  it("keeps stray quotes outside field starts literal", () => {
    expect(parseCsv("a\"b,c")).toEqual({ rows: [["a\"b", "c"]] });
  });

  it("supports alternate delimiters", () => {
    expect(parseCsv("a;b\tc", { delimiter: ";" })).toEqual({
      rows: [["a", "b\tc"]],
    });
    expect(parseCsv("a|b", { delimiter: "|" })).toEqual({
      rows: [["a", "b"]],
    });
  });

  it("returns the first record as a header when requested", () => {
    expect(parseCsv("h1,h2\n1,2", { hasHeader: true })).toEqual({
      header: ["h1", "h2"],
      rows: [["1", "2"]],
    });
    expect(parseCsv("h1,h2\n1,2", { hasHeader: false })).toEqual({
      rows: [["h1", "h2"], ["1", "2"]],
    });
  });

  it("skips blank lines while preserving empty cells", () => {
    expect(parseCsv("1,2\n\n3,4")).toEqual({
      rows: [["1", "2"], ["3", "4"]],
    });
    expect(parseCsv("a,\n,")).toEqual({ rows: [["a", ""], ["", ""]] });
  });

  it("rejects unterminated quotes", () => {
    expect(() => parseCsv('"open')).toThrow(CsvParseError);
  });

  it("rejects multi-character delimiters", () => {
    expect(() => parseCsv("a,b", { delimiter: "::" })).toThrow(CsvParseError);
  });
});
