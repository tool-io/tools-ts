import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacogenomics/pharmacogene-diplotype-order-canonicalizer", () => {
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
    expect(tool.execute({ first: "*1", second: "*4" })).toEqual({
      ok: true,
      output: { first: "*1", second: "*4", swapped: false },
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
});

describe("batch 67 review regressions", () => {
  it("orders variable-width suballele ordinals numerically", () => {
    expect(calculate({ first: "*2.9", second: "*2.10" })).toEqual({
      first: "*2.9",
      second: "*2.10",
      swapped: false,
    });
  });
  it("preserves large star-number spellings while comparing exactly", () => {
    expect(
      calculate({ first: "*10000000000000000000000", second: "*2" }),
    ).toEqual({
      first: "*2",
      second: "*10000000000000000000000",
      swapped: true,
    });
  });
});
