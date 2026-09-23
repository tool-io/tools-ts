import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bioinformatics/phased-genotype-missing-count", () => {
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
    expect(tool.execute({ genotype: "0/." })).toEqual({
      ok: true,
      output: { alleles: 2, missingAlleles: 1, fullyPhased: false },
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

  it.each([{ genotype: "0||1" }, { genotype: "0|x" }, { genotype: "0|1\n" }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ genotype: "0||1" }, { genotype: "0|x" }, { genotype: "0|1\n" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("mixed phase separators do not report full phasing", () => {
    const output = calculate({ genotype: "0|./1" });
    expect(output).toMatchObject({
      alleles: 3,
      missingAlleles: 1,
      fullyPhased: false,
    });
    expect(tool.execute({ genotype: "0|./1" })).toEqual({ ok: true, output });
  });
  it("haploid missingness is not a phased pair", () => {
    const output = calculate({ genotype: "." });
    expect(output).toMatchObject({
      alleles: 1,
      missingAlleles: 1,
      fullyPhased: false,
    });
    expect(tool.execute({ genotype: "." })).toEqual({ ok: true, output });
  });
});
