import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacokinetics/pk-clearance-research-auc-unit-factor", () => {
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
        amount: 200,
        auc: 40,
        amountUnitFactor: 0.001,
        aucUnitFactor: 0.001,
        bioavailableFraction: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        coherentAmount: 0.2,
        coherentAuc: 0.04,
        apparentClearance: 5,
        clearance: 5,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite amount", (value) =>
    expect(tool.execute({ ...example.input, amount: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite auc", (value) =>
    expect(tool.execute({ ...example.input, auc: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite amountUnitFactor",
    (value) =>
      expect(
        tool.execute({ ...example.input, amountUnitFactor: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite aucUnitFactor",
    (value) =>
      expect(tool.execute({ ...example.input, aucUnitFactor: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite bioavailableFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, bioavailableFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { amount: -1 },
    { auc: 0 },
    { amountUnitFactor: 0 },
    { aucUnitFactor: 0 },
    { bioavailableFraction: -1 },
    { bioavailableFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { amount: -1 },
    { auc: 0 },
    { amountUnitFactor: 0 },
    { aucUnitFactor: 0 },
    { bioavailableFraction: -1 },
    { bioavailableFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
