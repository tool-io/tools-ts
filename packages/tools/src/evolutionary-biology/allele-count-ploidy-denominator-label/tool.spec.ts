import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("evolutionary-biology/allele-count-ploidy-denominator-label", () => {
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
        sampledIndividuals: 0,
        ploidy: 2,
        callableAlleles: 0,
        alleleCount: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        possibleAlleles: 0,
        missingAlleles: 0,
        observedFrequency: 0,
        defined: false,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sampledIndividuals",
    (value) =>
      expect(
        tool.execute({ ...example.input, sampledIndividuals: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite ploidy", (value) =>
    expect(tool.execute({ ...example.input, ploidy: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite callableAlleles",
    (value) =>
      expect(
        tool.execute({ ...example.input, callableAlleles: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite alleleCount",
    (value) =>
      expect(tool.execute({ ...example.input, alleleCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { sampledIndividuals: -1 },
    { ploidy: 0 },
    { callableAlleles: -1 },
    { alleleCount: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { sampledIndividuals: -1 },
    { ploidy: 0 },
    { callableAlleles: -1 },
    { alleleCount: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 77 reviewed regressions", () => {
  it("rejects an unrepresentable integer denominator rather than publishing a rounded count", () => {
    expect(
      tool.execute({
        sampledIndividuals: Number.MAX_SAFE_INTEGER,
        ploidy: 2,
        callableAlleles: 0,
        alleleCount: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "result_out_of_range" }] },
    });
  });
});
