import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("optometry/lens-meridian-power-pair", () => {
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
        sphereDiopters: 1,
        cylinderDiopters: 0.5,
        axisDegrees: 120,
      }),
    ).toEqual({
      ok: true,
      output: {
        axisPowerDiopters: 1,
        orthogonalPowerDiopters: 1.5,
        orthogonalAxisDegrees: 30,
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
    "rejects nonfinite sphereDiopters",
    (value) =>
      expect(tool.execute({ ...example.input, sphereDiopters: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cylinderDiopters",
    (value) =>
      expect(
        tool.execute({ ...example.input, cylinderDiopters: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite axisDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, axisDegrees: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ axisDegrees: -1 }, { axisDegrees: 180 }])(
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
  it.each([{ axisDegrees: -1 }, { axisDegrees: 180 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ sphereDiopters: 0, cylinderDiopters: 0, axisDegrees: 90 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        axisPowerDiopters: 0,
        orthogonalPowerDiopters: 0,
        orthogonalAxisDegrees: 0,
      },
    });
    expect(calculate(input)).toEqual({
      axisPowerDiopters: 0,
      orthogonalPowerDiopters: 0,
      orthogonalAxisDegrees: 0,
    });
  });
});
