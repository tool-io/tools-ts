import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  csvQuotingEdgeCaseCorpusExample as example,
  calculateCsvQuotingEdgeCaseCorpus,
} from "./tool.js";

describe("Random CSV Quoting Edge-Case Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCsvQuotingEdgeCaseCorpus(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("retains CRLF, quotes, Unicode, delimiters, and string-looking numbers across supported separators", () => {
    for (const delimiter of [",", ";", "\t", "|"]) {
      const result = tool.execute({
        ...example.input,
        delimiter,
        kinds: ["crlf", "quote", "unicode", "delimiter", "unmodified"],
        fragments: ["001", "é", 'x"y'],
        rowCount: 20,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (const entry of result.output.cases) {
        expect(entry.parsedCells).toEqual(entry.cells);
        expect(entry.exactRoundTrip).toBe(true);
        expect(JSON.parse(entry.parsedJson)).toEqual(
          entry.cells.map((row) =>
            Object.fromEntries(["a", "b"].map((header, i) => [header, row[i]])),
          ),
        );
      }
    }
  });
  it("exposes empty-to-null conversion and singleton-empty record loss instead of claiming exact round trips", () => {
    expect(tool.execute({ ...example.input, kinds: ["empty"] })).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            cells: [
              ["", ""],
              ["", ""],
            ],
            parsedCells: [
              [null, null],
              [null, null],
            ],
            skippedSingleEmptyRows: 0,
            exactRoundTrip: false,
          },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, headers: ["value"], kinds: ["empty"] }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            cells: [[""], [""]],
            parsedCells: [],
            skippedSingleEmptyRows: 2,
            exactRoundTrip: false,
          },
        ],
      },
    });
  });
  it("rejects unsupported header quoting, duplicate headers, invalid separators, and excessive work", () => {
    for (const change of [
      { headers: ["bad,name"] },
      { headers: ["bad\n"] },
      { headers: ["a", "a"] },
      { delimiter: "::" },
      { rowCount: 65 },
      { caseCount: 16, rowCount: 64, headers: ["a", "b"] },
      { fragments: ["x".repeat(65)] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
