import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biomechanics/stride-contact-double-count-term", () => {
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
        leftContact: 0.3,
        rightContact: 0.3,
        simultaneous: 0,
        cycleDuration: 1,
      }),
    ).toEqual({
      ok: true,
      output: { unionContact: 0.6, flightDuration: 0.4, contactFraction: 0.6 },
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
    "rejects nonfinite leftContact",
    (value) =>
      expect(tool.execute({ ...example.input, leftContact: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rightContact",
    (value) =>
      expect(tool.execute({ ...example.input, rightContact: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite simultaneous",
    (value) =>
      expect(tool.execute({ ...example.input, simultaneous: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cycleDuration",
    (value) =>
      expect(tool.execute({ ...example.input, cycleDuration: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { leftContact: -1 },
    { rightContact: -1 },
    { simultaneous: -1 },
    { cycleDuration: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { leftContact: -1 },
    { rightContact: -1 },
    { simultaneous: -1 },
    { cycleDuration: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 69 reviewed regressions

it("subtracts the computed contact union once so the complete-contact boundary has zero flight", () => {
  expect(
    calculate({
      leftContact: 0.6,
      rightContact: 0.6,
      simultaneous: 0.2,
      cycleDuration: 1,
    }),
  ).toEqual({ unionContact: 1, flightDuration: 0, contactFraction: 1 });
});
