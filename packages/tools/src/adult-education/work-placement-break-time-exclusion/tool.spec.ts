import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("adult-education/work-placement-break-time-exclusion", () => {
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
        scheduled: 8,
        unpaidBreak: 1,
        overlappingBreak: 0,
        supervisedBreak: 0.5,
        excludeSupervised: false,
      }),
    ).toEqual({ ok: true, output: { counted: 7 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite scheduled", (value) =>
    expect(tool.execute({ ...example.input, scheduled: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite unpaidBreak",
    (value) =>
      expect(tool.execute({ ...example.input, unpaidBreak: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite overlappingBreak",
    (value) =>
      expect(
        tool.execute({ ...example.input, overlappingBreak: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite supervisedBreak",
    (value) =>
      expect(
        tool.execute({ ...example.input, supervisedBreak: value }).ok,
      ).toBe(false),
  );
  it.each([
    { overlappingBreak: 2 },
    { scheduled: -1 },
    { unpaidBreak: -1 },
    { overlappingBreak: -1 },
    { supervisedBreak: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { overlappingBreak: 2 },
    { scheduled: -1 },
    { unpaidBreak: -1 },
    { overlappingBreak: -1 },
    { supervisedBreak: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 69 reviewed regressions

it("credits overlap only when both break categories are excluded", () => {
  expect(
    calculate({
      scheduled: 8,
      unpaidBreak: 1,
      overlappingBreak: 0.25,
      supervisedBreak: 0.5,
      excludeSupervised: false,
    }),
  ).toEqual({ counted: 7 });
  expect(
    calculate({
      scheduled: 8,
      unpaidBreak: 1,
      overlappingBreak: 0.25,
      supervisedBreak: 0.5,
      excludeSupervised: true,
    }),
  ).toEqual({ counted: 6.75 });
});
