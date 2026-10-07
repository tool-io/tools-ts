import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biophysics/binding-free-energy-kd-ratio", () => {
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
        firstKd: 2,
        secondKd: 1,
        temperatureKelvin: 1,
        gasConstantJoulesPerMoleKelvin: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        firstMinusSecondFreeEnergyJoulesPerMole: expect.closeTo(
          0.6931471805599453,
          12,
        ),
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstKd", (value) =>
    expect(tool.execute({ ...example.input, firstKd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite secondKd", (value) =>
    expect(tool.execute({ ...example.input, secondKd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite temperatureKelvin",
    (value) =>
      expect(
        tool.execute({ ...example.input, temperatureKelvin: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasConstantJoulesPerMoleKelvin",
    (value) =>
      expect(
        tool.execute({
          ...example.input,
          gasConstantJoulesPerMoleKelvin: value,
        }).ok,
      ).toBe(false),
  );
  it.each([
    { firstKd: 0 },
    { secondKd: 0 },
    { temperatureKelvin: 0 },
    { gasConstantJoulesPerMoleKelvin: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstKd: 0 },
    { secondKd: 0 },
    { temperatureKelvin: 0 },
    { gasConstantJoulesPerMoleKelvin: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
