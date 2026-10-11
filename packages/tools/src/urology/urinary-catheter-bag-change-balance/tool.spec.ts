import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("urology/urinary-catheter-bag-change-balance", () => {
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
        openingMilliliters: 0,
        addedMilliliters: 100,
        emptiedMilliliters: 100,
        recordedClosingMilliliters: 0,
      }),
    ).toEqual({
      ok: true,
      output: { expectedClosingMilliliters: 0, discrepancyMilliliters: 0 },
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
    "rejects nonfinite openingMilliliters",
    (value) =>
      expect(
        tool.execute({ ...example.input, openingMilliliters: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite addedMilliliters",
    (value) =>
      expect(
        tool.execute({ ...example.input, addedMilliliters: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite emptiedMilliliters",
    (value) =>
      expect(
        tool.execute({ ...example.input, emptiedMilliliters: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recordedClosingMilliliters",
    (value) =>
      expect(
        tool.execute({ ...example.input, recordedClosingMilliliters: value })
          .ok,
      ).toBe(false),
  );
  it.each([
    { openingMilliliters: -1 },
    { addedMilliliters: -1 },
    { emptiedMilliliters: -1 },
    { recordedClosingMilliliters: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { openingMilliliters: -1 },
    { addedMilliliters: -1 },
    { emptiedMilliliters: -1 },
    { recordedClosingMilliliters: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 77 reviewed regressions", () => {
  it("preserves a negative discrepancy instead of clamping the record", () => {
    expect(
      calculate({
        openingMilliliters: 0,
        addedMilliliters: 100,
        emptiedMilliliters: 0,
        recordedClosingMilliliters: 80,
      }),
    ).toEqual({ expectedClosingMilliliters: 100, discrepancyMilliliters: -20 });
  });
});
