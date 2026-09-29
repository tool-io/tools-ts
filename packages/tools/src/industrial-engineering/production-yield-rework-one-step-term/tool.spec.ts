import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("industrial-engineering/production-yield-rework-one-step-term", () => {
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
        inputUnits: 100,
        firstPassYield: 0.5,
        reworkFraction: 1,
        reworkSuccess: 1,
      }),
    ).toEqual({
      ok: true,
      output: { firstPassGood: 50, reworkInput: 50, finalGood: 100, scrap: 0 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite inputUnits", (value) =>
    expect(tool.execute({ ...example.input, inputUnits: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstPassYield",
    (value) =>
      expect(tool.execute({ ...example.input, firstPassYield: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reworkFraction",
    (value) =>
      expect(tool.execute({ ...example.input, reworkFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reworkSuccess",
    (value) =>
      expect(tool.execute({ ...example.input, reworkSuccess: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { inputUnits: -1 },
    { firstPassYield: -1 },
    { firstPassYield: 2 },
    { reworkFraction: -1 },
    { reworkFraction: 2 },
    { reworkSuccess: -1 },
    { reworkSuccess: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { inputUnits: -1 },
    { firstPassYield: -1 },
    { firstPassYield: 2 },
    { reworkFraction: -1 },
    { reworkFraction: 2 },
    { reworkSuccess: -1 },
    { reworkSuccess: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
