import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-economics/icer-dominance-quadrant-label", () => {
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
    expect(tool.execute({ incrementalCost: 50, incrementalEffect: 0 })).toEqual(
      {
        ok: true,
        output: {
          classification: "extra cost, equal effect",
          icer: 0,
          ratioDefined: false,
        },
      },
    );
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
    "rejects nonfinite incrementalCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, incrementalCost: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite incrementalEffect",
    (value) =>
      expect(
        tool.execute({ ...example.input, incrementalEffect: value }).ok,
      ).toBe(false),
  );
});

describe("batch 77 contract refinements", () => {
  it.each([
    {
      incrementalCost: -20,
      incrementalEffect: 2,
      classification: "dominant",
      icer: -10,
      ratioDefined: true,
    },
    {
      incrementalCost: 20,
      incrementalEffect: -2,
      classification: "dominated",
      icer: -10,
      ratioDefined: true,
    },
    {
      incrementalCost: 20,
      incrementalEffect: 2,
      classification: "more costly and more effective",
      icer: 10,
      ratioDefined: true,
    },
    {
      incrementalCost: -20,
      incrementalEffect: -2,
      classification: "less costly and less effective",
      icer: 10,
      ratioDefined: true,
    },
    {
      incrementalCost: 0,
      incrementalEffect: 2,
      classification: "equal cost, effect gain",
      icer: 0,
      ratioDefined: true,
    },
    {
      incrementalCost: 0,
      incrementalEffect: -2,
      classification: "equal cost, effect loss",
      icer: 0,
      ratioDefined: true,
    },
    {
      incrementalCost: 20,
      incrementalEffect: 0,
      classification: "extra cost, equal effect",
      icer: 0,
      ratioDefined: false,
    },
    {
      incrementalCost: -20,
      incrementalEffect: 0,
      classification: "cost saving, equal effect",
      icer: 0,
      ratioDefined: false,
    },
    {
      incrementalCost: 0,
      incrementalEffect: 0,
      classification: "no difference",
      icer: 0,
      ratioDefined: false,
    },
  ])(
    "distinguishes each strict quadrant and axis boundary %j",
    ({ classification, icer, ratioDefined, ...input }) => {
      expect(calculate(input)).toEqual({ classification, icer, ratioDefined });
    },
  );
});
