import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("human-geography/landuse-trip-rate-one-parcel-term", () => {
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
        floorArea: 500,
        unitArea: 100,
        tripRate: 4,
        passbyFraction: 0,
        internalCaptureFraction: 0.25,
      }),
    ).toEqual({ ok: true, output: { grossTrips: 20, externalNewTrips: 15 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite floorArea", (value) =>
    expect(tool.execute({ ...example.input, floorArea: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite unitArea", (value) =>
    expect(tool.execute({ ...example.input, unitArea: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tripRate", (value) =>
    expect(tool.execute({ ...example.input, tripRate: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite passbyFraction",
    (value) =>
      expect(tool.execute({ ...example.input, passbyFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite internalCaptureFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, internalCaptureFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { floorArea: -1 },
    { unitArea: 0 },
    { tripRate: -1 },
    { passbyFraction: -1 },
    { passbyFraction: 2 },
    { internalCaptureFraction: -1 },
    { internalCaptureFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { floorArea: -1 },
    { unitArea: 0 },
    { tripRate: -1 },
    { passbyFraction: -1 },
    { passbyFraction: 2 },
    { internalCaptureFraction: -1 },
    { internalCaptureFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
