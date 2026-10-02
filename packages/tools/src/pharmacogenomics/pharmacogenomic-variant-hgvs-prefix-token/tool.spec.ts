import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacogenomics/pharmacogenomic-variant-hgvs-prefix-token", () => {
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
    expect(tool.execute({ token: "NC_000001.11:g.100del" })).toEqual({
      ok: true,
      output: {
        accession: "NC_000001.11",
        coordinateSystem: "g",
        description: "100del",
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

describe("batch 67 review regressions", () => {
  it("recognizes the circular-reference o coordinate prefix", () => {
    expect(calculate({ token: "REF_001.1:o.100del" })).toEqual({
      accession: "REF_001.1",
      coordinateSystem: "o",
      description: "100del",
    });
  });
  it("rejects trailing line terminators as a token domain issue", () => {
    expect(tool.execute({ token: "REF_001.1:c.1A>G\n" })).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "token", code: "invalid_domain" }],
      },
    });
  });
});
