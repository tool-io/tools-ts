import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("advertising/impression-viewability-source-threshold", () => {
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
        recordedVisibleFraction: 0.4,
        recordedSeconds: 3,
        suppliedMinimumFraction: 0.5,
        suppliedMinimumSeconds: 2,
      }),
    ).toEqual({ ok: true, output: { meetsSuppliedThresholds: false } });
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
    "rejects nonfinite recordedVisibleFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, recordedVisibleFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recordedSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, recordedSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedMinimumFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedMinimumFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedMinimumSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedMinimumSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([
    { recordedVisibleFraction: -1 },
    { recordedVisibleFraction: 2 },
    { recordedSeconds: -1 },
    { suppliedMinimumFraction: -1 },
    { suppliedMinimumFraction: 2 },
    { suppliedMinimumSeconds: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { recordedVisibleFraction: -1 },
    { recordedVisibleFraction: 2 },
    { recordedSeconds: -1 },
    { suppliedMinimumFraction: -1 },
    { suppliedMinimumFraction: 2 },
    { suppliedMinimumSeconds: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
