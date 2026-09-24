import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("classification/binary-rejection-cost-indifference", () => {
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
        positiveProbability: 0.25,
        falsePositiveCost: 2,
        falseNegativeCost: 4,
        rejectionCost: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        negativeRisk: 1,
        positiveRisk: 1.5,
        rejectRisk: 1,
        tiedActions: ["negative"],
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite positiveProbability",
    (value) =>
      expect(
        tool.execute({ ...example.input, positiveProbability: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite falsePositiveCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, falsePositiveCost: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite falseNegativeCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, falseNegativeCost: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rejectionCost",
    (value) =>
      expect(tool.execute({ ...example.input, rejectionCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { positiveProbability: -1 },
    { positiveProbability: 2 },
    { falsePositiveCost: -1 },
    { falseNegativeCost: -1 },
    { rejectionCost: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { positiveProbability: -1 },
    { positiveProbability: 2 },
    { falsePositiveCost: -1 },
    { falseNegativeCost: -1 },
    { rejectionCost: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
