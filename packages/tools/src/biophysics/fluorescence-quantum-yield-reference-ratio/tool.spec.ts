import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biophysics/fluorescence-quantum-yield-reference-ratio", () => {
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
        sampleIntegratedSignal: 100,
        referenceIntegratedSignal: 100,
        sampleAbsorbance: 0.05,
        referenceAbsorbance: 0.1,
        referenceYield: 0.5,
        sampleRefractiveIndex: 1,
        referenceRefractiveIndex: 1,
      }),
    ).toEqual({
      ok: true,
      output: { relativeYield: expect.closeTo(0.9456254690668727, 12) },
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
    "rejects nonfinite sampleIntegratedSignal",
    (value) =>
      expect(
        tool.execute({ ...example.input, sampleIntegratedSignal: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceIntegratedSignal",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceIntegratedSignal: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sampleAbsorbance",
    (value) =>
      expect(
        tool.execute({ ...example.input, sampleAbsorbance: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceAbsorbance",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceAbsorbance: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceYield",
    (value) =>
      expect(tool.execute({ ...example.input, referenceYield: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sampleRefractiveIndex",
    (value) =>
      expect(
        tool.execute({ ...example.input, sampleRefractiveIndex: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceRefractiveIndex",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceRefractiveIndex: value }).ok,
      ).toBe(false),
  );
  it.each([
    { sampleIntegratedSignal: -1 },
    { referenceIntegratedSignal: 0 },
    { sampleAbsorbance: 0 },
    { referenceAbsorbance: 0 },
    { referenceYield: -1 },
    { referenceYield: 2 },
    { sampleRefractiveIndex: 0 },
    { referenceRefractiveIndex: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { sampleIntegratedSignal: -1 },
    { referenceIntegratedSignal: 0 },
    { sampleAbsorbance: 0 },
    { referenceAbsorbance: 0 },
    { referenceYield: -1 },
    { referenceYield: 2 },
    { sampleRefractiveIndex: 0 },
    { referenceRefractiveIndex: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 76 reviewed regressions", () => {
  it("uses exact absorbed fractions and the squared refractive correction", () => {
    const result = calculate({
      sampleIntegratedSignal: 100,
      referenceIntegratedSignal: 100,
      sampleAbsorbance: 0.3010299956639812,
      referenceAbsorbance: 0.6020599913279624,
      referenceYield: 0.5,
      sampleRefractiveIndex: 1.5,
      referenceRefractiveIndex: 1,
    });
    expect(result.relativeYield).toBeCloseTo(1.6875, 12);
  });
});
