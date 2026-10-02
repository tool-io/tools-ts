import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("proportions/mixture-target-share-residual", () => {
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
        firstAmount: 1,
        secondAmount: 1,
        firstFraction: 0,
        secondFraction: 1,
        targetFraction: 0.25,
      }),
    ).toEqual({ ok: true, output: { actualFraction: 0.5, residual: 0.25 } });
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
    "rejects nonfinite firstAmount",
    (value) =>
      expect(tool.execute({ ...example.input, firstAmount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondAmount",
    (value) =>
      expect(tool.execute({ ...example.input, secondAmount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstFraction",
    (value) =>
      expect(tool.execute({ ...example.input, firstFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondFraction",
    (value) =>
      expect(tool.execute({ ...example.input, secondFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetFraction",
    (value) =>
      expect(tool.execute({ ...example.input, targetFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { firstAmount: -1 },
    { secondAmount: -1 },
    { firstFraction: -1 },
    { firstFraction: 2 },
    { secondFraction: -1 },
    { secondFraction: 2 },
    { targetFraction: -1 },
    { targetFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstAmount: -1 },
    { secondAmount: -1 },
    { firstFraction: -1 },
    { firstFraction: 2 },
    { secondFraction: -1 },
    { secondFraction: 2 },
    { targetFraction: -1 },
    { targetFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
