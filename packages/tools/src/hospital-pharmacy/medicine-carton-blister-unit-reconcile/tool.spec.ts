import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("hospital-pharmacy/medicine-carton-blister-unit-reconcile", () => {
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
        cartons: 1,
        blistersPerCarton: 4,
        unitsPerBlister: 7,
        looseBlisters: 0,
        looseUnits: 2,
        declared: 30,
      }),
    ).toEqual({ ok: true, output: { calculated: 30, discrepancy: 0 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cartons", (value) =>
    expect(tool.execute({ ...example.input, cartons: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite blistersPerCarton",
    (value) =>
      expect(
        tool.execute({ ...example.input, blistersPerCarton: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite unitsPerBlister",
    (value) =>
      expect(
        tool.execute({ ...example.input, unitsPerBlister: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite looseBlisters",
    (value) =>
      expect(tool.execute({ ...example.input, looseBlisters: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite looseUnits", (value) =>
    expect(tool.execute({ ...example.input, looseUnits: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite declared", (value) =>
    expect(tool.execute({ ...example.input, declared: value }).ok).toBe(false),
  );
  it.each([
    { cartons: -1 },
    { blistersPerCarton: 0 },
    { unitsPerBlister: 0 },
    { looseBlisters: -1 },
    { looseUnits: -1 },
    { declared: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { cartons: -1 },
    { blistersPerCarton: 0 },
    { unitsPerBlister: 0 },
    { looseBlisters: -1 },
    { looseUnits: -1 },
    { declared: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
