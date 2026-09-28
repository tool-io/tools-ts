import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geriatrics/appointment-hearing-interpretation-time-budget", () => {
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
        baseMinutes: 40,
        interpretedFraction: 1,
        interpretationMultiplier: 1.5,
        setupMinutes: 10,
        availableMinutes: 60,
      }),
    ).toEqual({
      ok: true,
      output: { requiredMinutes: 70, slackMinutes: -10, fits: false },
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
    "rejects nonfinite baseMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, baseMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite interpretedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, interpretedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite interpretationMultiplier",
    (value) =>
      expect(
        tool.execute({ ...example.input, interpretationMultiplier: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite setupMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, setupMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite availableMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, availableMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([
    { baseMinutes: -1 },
    { interpretedFraction: -1 },
    { interpretedFraction: 2 },
    { interpretationMultiplier: 0 },
    { setupMinutes: -1 },
    { availableMinutes: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { baseMinutes: -1 },
    { interpretedFraction: -1 },
    { interpretedFraction: 2 },
    { interpretationMultiplier: 0 },
    { setupMinutes: -1 },
    { availableMinutes: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
