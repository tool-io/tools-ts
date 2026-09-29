import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-business/foreign-office-cost-recharge-markup", () => {
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
        costPool: 5000,
        allocatedFraction: 0.4,
        markupFraction: 0.25,
        recipientPerLocal: 0.8,
      }),
    ).toEqual({
      ok: true,
      output: {
        allocatedLocalCost: 2000,
        localRecharge: 2500,
        recipientRecharge: 2000,
      },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite costPool", (value) =>
    expect(tool.execute({ ...example.input, costPool: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite allocatedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, allocatedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite markupFraction",
    (value) =>
      expect(tool.execute({ ...example.input, markupFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recipientPerLocal",
    (value) =>
      expect(
        tool.execute({ ...example.input, recipientPerLocal: value }).ok,
      ).toBe(false),
  );
  it.each([
    { costPool: -1 },
    { allocatedFraction: -1 },
    { allocatedFraction: 2 },
    { markupFraction: -1 },
    { recipientPerLocal: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { costPool: -1 },
    { allocatedFraction: -1 },
    { allocatedFraction: 2 },
    { markupFraction: -1 },
    { recipientPerLocal: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
