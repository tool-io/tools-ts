import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("occupational-therapy/adaptive-equipment-loan-deposit-balance", () => {
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
        deposit: 80,
        retainedDamage: 0,
        retainedCleaning: 0,
        returned: 80,
        outstandingRental: 10,
      }),
    ).toEqual({
      ok: true,
      output: { refundable: 80, refundDue: 0, accountBalance: 10 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite deposit", (value) =>
    expect(tool.execute({ ...example.input, deposit: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite retainedDamage",
    (value) =>
      expect(tool.execute({ ...example.input, retainedDamage: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite retainedCleaning",
    (value) =>
      expect(
        tool.execute({ ...example.input, retainedCleaning: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite returned", (value) =>
    expect(tool.execute({ ...example.input, returned: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite outstandingRental",
    (value) =>
      expect(
        tool.execute({ ...example.input, outstandingRental: value }).ok,
      ).toBe(false),
  );
  it.each([
    { deposit: -1 },
    { retainedDamage: -1 },
    { retainedCleaning: -1 },
    { returned: -1 },
    { outstandingRental: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { deposit: -1 },
    { retainedDamage: -1 },
    { retainedCleaning: -1 },
    { returned: -1 },
    { outstandingRental: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
