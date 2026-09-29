import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("industrial-pharmacy/pharmaceutical-container-closure-bench-clearance", () => {
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
        boreDiameter: 10,
        closureDiameter: 10.2,
        toleranceBore: 0.1,
        toleranceClosure: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: {
        nominalGap: -0.1999999999999993,
        minimumGap: -0.39999999999999925,
        maximumGap: 7.216449660063518e-16,
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
    "rejects nonfinite boreDiameter",
    (value) =>
      expect(tool.execute({ ...example.input, boreDiameter: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite closureDiameter",
    (value) =>
      expect(
        tool.execute({ ...example.input, closureDiameter: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite toleranceBore",
    (value) =>
      expect(tool.execute({ ...example.input, toleranceBore: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite toleranceClosure",
    (value) =>
      expect(
        tool.execute({ ...example.input, toleranceClosure: value }).ok,
      ).toBe(false),
  );
  it.each([
    { boreDiameter: -1 },
    { closureDiameter: -1 },
    { toleranceBore: -1 },
    { toleranceClosure: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { boreDiameter: -1 },
    { closureDiameter: -1 },
    { toleranceBore: -1 },
    { toleranceClosure: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
