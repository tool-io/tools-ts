import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("game-theory/stag-hunt-risk-dominance-payoff-product", () => {
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
        firstStagDeviationLoss: 1,
        secondStagDeviationLoss: 1,
        firstHareDeviationLoss: 2,
        secondHareDeviationLoss: 3,
      }),
    ).toEqual({
      ok: true,
      output: {
        stagLossProduct: 1,
        hareLossProduct: 6,
        stagRiskDominates: false,
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
    "rejects nonfinite firstStagDeviationLoss",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstStagDeviationLoss: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondStagDeviationLoss",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondStagDeviationLoss: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstHareDeviationLoss",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstHareDeviationLoss: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondHareDeviationLoss",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondHareDeviationLoss: value }).ok,
      ).toBe(false),
  );
  it.each([
    { firstStagDeviationLoss: -1 },
    { secondStagDeviationLoss: -1 },
    { firstHareDeviationLoss: -1 },
    { secondHareDeviationLoss: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstStagDeviationLoss: -1 },
    { secondStagDeviationLoss: -1 },
    { firstHareDeviationLoss: -1 },
    { secondHareDeviationLoss: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        firstStagDeviationLoss: 2,
        secondStagDeviationLoss: 2,
        firstHareDeviationLoss: 2,
        secondHareDeviationLoss: 2,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        stagLossProduct: 4,
        hareLossProduct: 4,
        stagRiskDominates: false,
      },
    });
    expect(calculate(input)).toEqual({
      stagLossProduct: 4,
      hareLossProduct: 4,
      stagRiskDominates: false,
    });
  });
});
