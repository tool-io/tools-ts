import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("industrial-engineering/time-study-rating-allowance-factor", () => {
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
        observedTime: 10,
        ratingFactor: 1.2,
        allowanceFraction: 0.2,
        allowanceOfNormal: false,
      }),
    ).toEqual({ ok: true, output: { normalTime: 12, standardTime: 15 } });
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
    "rejects nonfinite observedTime",
    (value) =>
      expect(tool.execute({ ...example.input, observedTime: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite ratingFactor",
    (value) =>
      expect(tool.execute({ ...example.input, ratingFactor: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite allowanceFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, allowanceFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { observedTime: -1 },
    { ratingFactor: 0 },
    { allowanceFraction: -1 },
    { allowanceFraction: 1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { observedTime: -1 },
    { ratingFactor: 0 },
    { allowanceFraction: -1 },
    { allowanceFraction: 1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
