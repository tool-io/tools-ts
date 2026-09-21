import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agroforestry/woody-biomass-sample-expansion", () => {
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
        sampleDryMass: 10,
        sampleArea: 2,
        targetArea: 20,
        suppliedInclusionWeight: 1,
      }),
    ).toEqual({ ok: true, output: { expandedMass: 100 } });
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
    "rejects nonfinite sampleDryMass",
    (value) =>
      expect(tool.execute({ ...example.input, sampleDryMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite sampleArea", (value) =>
    expect(tool.execute({ ...example.input, sampleArea: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite targetArea", (value) =>
    expect(tool.execute({ ...example.input, targetArea: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedInclusionWeight",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedInclusionWeight: value }).ok,
      ).toBe(false),
  );
  it.each([
    { sampleDryMass: -1 },
    { sampleArea: 0 },
    { targetArea: -1 },
    { suppliedInclusionWeight: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { sampleDryMass: -1 },
    { sampleArea: 0 },
    { targetArea: -1 },
    { suppliedInclusionWeight: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
