import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bioinformatics/vcf-missing-genotype-ploidy-token", () => {
  it("distinguishes haploid missingness from partial phasing", () => {
    expect(calculate({ genotype: "." })).toEqual({
      ploidy: 1,
      allMissing: true,
      partiallyMissing: false,
      phased: false,
    });
    expect(calculate({ genotype: "0|1/." })).toEqual({
      ploidy: 3,
      allMissing: false,
      partiallyMissing: true,
      phased: false,
    });
  });
  it("rejects a trailing newline instead of accepting a partial genotype token", () => {
    const result = tool.execute({ genotype: "0/1\n" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_domain");
  });
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
    expect(tool.execute({ genotype: "0|." })).toEqual({
      ok: true,
      output: {
        ploidy: 2,
        allMissing: false,
        partiallyMissing: true,
        phased: true,
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
