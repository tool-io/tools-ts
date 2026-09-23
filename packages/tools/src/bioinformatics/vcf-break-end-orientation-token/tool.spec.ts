import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bioinformatics/vcf-break-end-orientation-token", () => {
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
    expect(tool.execute({ allele: "[chr2:20[T" })).toEqual({
      ok: true,
      output: {
        remote: "chr2:20",
        bracket: "[",
        localSequence: "T",
        sequencePlacement: "after-remote",
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
    { allele: "A]chr1:10[" },
    { allele: "A]chr1:0]" },
    { allele: "A]chr1:10]\n" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { allele: "A]chr1:10[" },
    { allele: "A]chr1:0]" },
    { allele: "A]chr1:10]\n" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 69 reviewed regressions

it("distinguishes all paired bracket placements and rejects remote whitespace", () => {
  expect(calculate({ allele: "]chr2:20]T" })).toEqual({
    remote: "chr2:20",
    bracket: "]",
    localSequence: "T",
    sequencePlacement: "after-remote",
  });
  expect(calculate({ allele: "A[chr1:10[" })).toEqual({
    remote: "chr1:10",
    bracket: "[",
    localSequence: "A",
    sequencePlacement: "before-remote",
  });
  expect(tool.execute({ allele: "A]chr 1:10]" })).toMatchObject({
    ok: false,
    error: { code: "invalid_input" },
  });
  expect(tool.execute({ allele: "A]chr1:10]\n" })).toMatchObject({
    ok: false,
    error: { code: "invalid_input" },
  });
});
