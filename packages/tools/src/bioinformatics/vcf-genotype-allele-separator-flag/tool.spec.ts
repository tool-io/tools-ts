import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bioinformatics/vcf-genotype-allele-separator-flag", () => {
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
    expect(tool.execute({ genotypeToken: "./." })).toEqual({
      ok: true,
      output: {
        alleleTokens: [".", "."],
        separators: ["/"],
        hasPhasedSeparator: false,
        hasUnphasedSeparator: true,
      },
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

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = { ...example.input, ...{ genotypeToken: "|0|1/2" } };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        alleleTokens: ["0", "1", "2"],
        separators: ["|", "|", "/"],
        hasPhasedSeparator: true,
        hasUnphasedSeparator: true,
      },
    });
    expect(calculate(input)).toEqual({
      alleleTokens: ["0", "1", "2"],
      separators: ["|", "|", "/"],
      hasPhasedSeparator: true,
      hasUnphasedSeparator: true,
    });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = { ...example.input, ...{ genotypeToken: "." } };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        alleleTokens: ["."],
        separators: [],
        hasPhasedSeparator: false,
        hasUnphasedSeparator: false,
      },
    });
    expect(calculate(input)).toEqual({
      alleleTokens: ["."],
      separators: [],
      hasPhasedSeparator: false,
      hasUnphasedSeparator: false,
    });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ genotypeToken: "0//1" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "genotypeToken", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
