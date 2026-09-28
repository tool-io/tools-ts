import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-policy/policy-notice-accessible-format-cost-term", () => {
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
        copies: 50,
        baseUnitCost: 2,
        accessibleCopies: 0,
        accessibleUnitCost: 4,
        fixedConversion: 100,
      }),
    ).toEqual({
      ok: true,
      output: { standardCopies: 50, productionCost: 100, totalCost: 100 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite copies", (value) =>
    expect(tool.execute({ ...example.input, copies: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite baseUnitCost",
    (value) =>
      expect(tool.execute({ ...example.input, baseUnitCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite accessibleCopies",
    (value) =>
      expect(
        tool.execute({ ...example.input, accessibleCopies: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite accessibleUnitCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, accessibleUnitCost: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fixedConversion",
    (value) =>
      expect(
        tool.execute({ ...example.input, fixedConversion: value }).ok,
      ).toBe(false),
  );
  it.each([
    { copies: -1 },
    { baseUnitCost: -1 },
    { accessibleCopies: -1 },
    { accessibleUnitCost: -1 },
    { fixedConversion: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { copies: -1 },
    { baseUnitCost: -1 },
    { accessibleCopies: -1 },
    { accessibleUnitCost: -1 },
    { fixedConversion: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
