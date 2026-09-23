import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bioinformatics/cigar-reference-consumption-gap", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(
      tool.execute({ cigar: "6M14N5M", suppliedReferenceSpan: "24" }),
    ).toEqual({
      ok: true,
      output: { consumedReferenceDecimal: "25", gapDecimal: "1" },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });

  it.each([
    { cigar: "0M" },
    { cigar: "10M\n" },
    { cigar: "10Z" },
    { suppliedReferenceSpan: "-1" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { cigar: "0M" },
    { cigar: "10M\n" },
    { cigar: "10Z" },
    { suppliedReferenceSpan: "-1" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("only M D N equals and X consume reference", () => {
    const output = calculate({
      cigar: "2H3S4M2I5D6N7=8X1P",
      suppliedReferenceSpan: "29",
    });
    expect(output).toMatchObject({
      consumedReferenceDecimal: "30",
      gapDecimal: "1",
    });
    expect(
      tool.execute({
        cigar: "2H3S4M2I5D6N7=8X1P",
        suppliedReferenceSpan: "29",
      }),
    ).toEqual({ ok: true, output });
  });
  it("rejects malformed trailing CIGAR spelling", () => {
    expect(
      tool.execute({ cigar: "10M\n", suppliedReferenceSpan: "10" }),
    ).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "cigar" }],
      },
    });
    expect(() =>
      calculate({ cigar: "10M\n", suppliedReferenceSpan: "10" }),
    ).toThrow();
  });
});
