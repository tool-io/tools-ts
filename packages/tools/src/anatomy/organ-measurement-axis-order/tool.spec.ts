import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("anatomy/organ-measurement-axis-order", () => {
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
      tool.execute({ length: 5, width: 3, depth: 2, outputOrder: "LDW" }),
    ).toEqual({ ok: true, output: { orderedMeasurements: [5, 2, 3] } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite length", (value) =>
    expect(tool.execute({ ...example.input, length: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite width", (value) =>
    expect(tool.execute({ ...example.input, width: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite depth", (value) =>
    expect(tool.execute({ ...example.input, depth: value }).ok).toBe(false),
  );
  it.each([
    { length: -1 },
    { width: -1 },
    { depth: -1 },
    { outputOrder: "__invalid_enum__" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { length: -1 },
    { width: -1 },
    { depth: -1 },
    { outputOrder: "__invalid_enum__" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 77 contract refinements", () => {
  it.each([
    { outputOrder: "WDL", orderedMeasurements: [3, 2, 5] },
    { outputOrder: "DLW", orderedMeasurements: [2, 5, 3] },
    { outputOrder: "DWL", orderedMeasurements: [2, 3, 5] },
  ])(
    "supports each remaining axis permutation %j",
    ({ outputOrder, orderedMeasurements }) => {
      expect(calculate({ length: 5, width: 3, depth: 2, outputOrder })).toEqual(
        { orderedMeasurements },
      );
    },
  );
});
