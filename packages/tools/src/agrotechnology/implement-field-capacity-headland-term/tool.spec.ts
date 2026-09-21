import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agrotechnology/implement-field-capacity-headland-term", () => {
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
        widthMeters: 3,
        speedKmPerHour: 10,
        fieldEfficiency: 0.75,
        headlandFraction: 0,
      }),
    ).toEqual({
      ok: true,
      output: { theoreticalHaPerHour: 3, effectiveHaPerHour: 2.25 },
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
    "rejects nonfinite widthMeters",
    (value) =>
      expect(tool.execute({ ...example.input, widthMeters: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite speedKmPerHour",
    (value) =>
      expect(tool.execute({ ...example.input, speedKmPerHour: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fieldEfficiency",
    (value) =>
      expect(
        tool.execute({ ...example.input, fieldEfficiency: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite headlandFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, headlandFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { widthMeters: -1 },
    { speedKmPerHour: -1 },
    { fieldEfficiency: -1 },
    { fieldEfficiency: 2 },
    { headlandFraction: -1 },
    { headlandFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { widthMeters: -1 },
    { speedKmPerHour: -1 },
    { fieldEfficiency: -1 },
    { fieldEfficiency: 2 },
    { headlandFraction: -1 },
    { headlandFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
