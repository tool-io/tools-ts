import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("proportions/part-share-after-exclusion", () => {
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
        part: 10,
        whole: 10,
        excludedFromWhole: 10,
        excludedFromPart: 10,
      }),
    ).toEqual({
      ok: true,
      output: { remainingPart: 0, remainingWhole: 0, share: 0, defined: false },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite part", (value) =>
    expect(tool.execute({ ...example.input, part: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite whole", (value) =>
    expect(tool.execute({ ...example.input, whole: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite excludedFromWhole",
    (value) =>
      expect(
        tool.execute({ ...example.input, excludedFromWhole: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite excludedFromPart",
    (value) =>
      expect(
        tool.execute({ ...example.input, excludedFromPart: value }).ok,
      ).toBe(false),
  );
  it.each([
    { excludedFromPart: 25 },
    { excludedFromWhole: 110 },
    { part: -1 },
    { whole: -1 },
    { excludedFromWhole: -1 },
    { excludedFromPart: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { excludedFromPart: 25 },
    { excludedFromWhole: 110 },
    { part: -1 },
    { whole: -1 },
    { excludedFromWhole: -1 },
    { excludedFromPart: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
