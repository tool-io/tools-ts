import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("chemical-engineering/gas-holder-normal-volume-correction", () => {
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
        measuredVolume: 0,
        measuredAbsolutePressure: 100,
        referenceAbsolutePressure: 100,
        measuredKelvin: 300,
        referenceKelvin: 273.15,
      }),
    ).toEqual({ ok: true, output: { referenceVolume: 0 } });
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
    "rejects nonfinite measuredVolume",
    (value) =>
      expect(tool.execute({ ...example.input, measuredVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite measuredAbsolutePressure",
    (value) =>
      expect(
        tool.execute({ ...example.input, measuredAbsolutePressure: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceAbsolutePressure",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceAbsolutePressure: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite measuredKelvin",
    (value) =>
      expect(tool.execute({ ...example.input, measuredKelvin: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceKelvin",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceKelvin: value }).ok,
      ).toBe(false),
  );
  it.each([
    { measuredVolume: -1 },
    { measuredAbsolutePressure: 0 },
    { referenceAbsolutePressure: 0 },
    { measuredKelvin: 0 },
    { referenceKelvin: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { measuredVolume: -1 },
    { measuredAbsolutePressure: 0 },
    { referenceAbsolutePressure: 0 },
    { measuredKelvin: 0 },
    { referenceKelvin: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        measuredVolume: 10,
        measuredAbsolutePressure: 100,
        referenceAbsolutePressure: 100,
        measuredKelvin: 300,
        referenceKelvin: 300,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { referenceVolume: 10 },
    });
    expect(calculate(input)).toEqual({ referenceVolume: 10 });
  });
});
