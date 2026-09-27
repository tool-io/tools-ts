import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("evolutionary-biology/codon-synonymous-site-mask", () => {
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
      tool.execute({
        codon: "GCT",
        codeCodons: ["GCT", "GCC"],
        aminoAcids: ["A", "A"],
        neighborCodons: ["GCC"],
        neighborWeights: [1],
        excludedAminoAcidTokens: ["*"],
      }),
    ).toEqual({
      ok: true,
      output: {
        synonymousMask: [true],
        siteOpportunity: [0, 0, 1],
        totalOpportunity: 1,
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

  it.each([
    { neighborCodons: ["GCT", "GAT"] },
    { neighborCodons: ["GAA", "GAT"] },
    { aminoAcids: [] },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { neighborCodons: ["GCT", "GAT"] },
    { neighborCodons: ["GAA", "GAT"] },
    { aminoAcids: [] },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("nested finite neighborWeights validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, neighborWeights: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "neighborWeights" }],
        },
      });
    },
  );
});

describe("independently reviewed regressions", () => {
  it("honors a supplied alternative code instead of universal stop assumptions", () => {
    const output = calculate({
      codon: "TGA",
      codeCodons: ["TGA", "TGG"],
      aminoAcids: ["W", "W"],
      neighborCodons: ["TGG"],
      neighborWeights: [1],
      excludedAminoAcidTokens: ["*"],
    });
    expect(output).toMatchObject({
      synonymousMask: [true],
      siteOpportunity: [0, 0, 1],
      totalOpportunity: 1,
    });
    expect(
      tool.execute({
        codon: "TGA",
        codeCodons: ["TGA", "TGG"],
        aminoAcids: ["W", "W"],
        neighborCodons: ["TGG"],
        neighborWeights: [1],
        excludedAminoAcidTokens: ["*"],
      }),
    ).toEqual({ ok: true, output });
  });
  it("rejects an explicitly excluded source label", () => {
    expect(
      tool.execute({
        codon: "TGA",
        codeCodons: ["TGA", "TGG"],
        aminoAcids: ["*", "W"],
        neighborCodons: ["TGG"],
        neighborWeights: [1],
        excludedAminoAcidTokens: ["*"],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "codon" }],
      },
    });
    expect(() =>
      calculate({
        codon: "TGA",
        codeCodons: ["TGA", "TGG"],
        aminoAcids: ["*", "W"],
        neighborCodons: ["TGG"],
        neighborWeights: [1],
        excludedAminoAcidTokens: ["*"],
      }),
    ).toThrow();
  });
});
