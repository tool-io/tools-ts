import { describe, expect, it } from "vitest";
import {
  calculateCsvToMarkdown,
  csvToMarkdownExample,
  runCsvToMarkdown,
} from "./tool.js";

describe("CSV to Markdown table converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCsvToMarkdown(csvToMarkdownExample.input)).toEqual({
      ok: true,
      output: csvToMarkdownExample.output,
    });
  });

  it("escapes pipes and converts cell newlines", () => {
    const output = calculateCsvToMarkdown({
      csv: 'a,b\n"x|y","p\nq"',
    });
    expect(output.markdown).toBe(
      "| a | b |\n| --- | --- |\n| x\\|y | p<br>q |",
    );
  });

  it("declares alignment in the separator row", () => {
    const output = calculateCsvToMarkdown({
      alignment: "right",
      csv: "name,score\nAda,99",
    });
    expect(output.markdown).toBe(
      "| name | score |\n| ---: | ---: |\n| Ada | 99 |",
    );
  });

  it("emits a body-only table without a header", () => {
    const output = calculateCsvToMarkdown({
      csv: "1,2",
      hasHeader: false,
    });
    expect(output.markdown).toBe("| 1 | 2 |");
  });

  it("rejects empty input and ragged rows through execution", () => {
    expect(runCsvToMarkdown({ csv: "" })).toMatchObject({
      error: { issues: [{ code: "empty_csv" }] },
      ok: false,
    });
    expect(runCsvToMarkdown({ csv: "a,b\n1" })).toMatchObject({
      error: { issues: [{ code: "inconsistent_row_count" }] },
      ok: false,
    });
    expect(runCsvToMarkdown({ csv: '"open' })).toMatchObject({
      error: { issues: [{ code: "invalid_csv" }] },
      ok: false,
    });
  });
});
