import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("adult-education/qualification-renewal-credit-one-module", () => {
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
        moduleHours: 6,
        creditPerHour: 0.5,
        eligibleFraction: 1,
        existingCredit: 10,
        requiredCredit: 12,
      }),
    ).toEqual({
      ok: true,
      output: { moduleCredit: 3, projectedCredit: 13, remaining: 0 },
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
    "rejects nonfinite moduleHours",
    (value) =>
      expect(tool.execute({ ...example.input, moduleHours: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite creditPerHour",
    (value) =>
      expect(tool.execute({ ...example.input, creditPerHour: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite eligibleFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, eligibleFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite existingCredit",
    (value) =>
      expect(tool.execute({ ...example.input, existingCredit: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite requiredCredit",
    (value) =>
      expect(tool.execute({ ...example.input, requiredCredit: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { moduleHours: -1 },
    { creditPerHour: -1 },
    { eligibleFraction: -1 },
    { eligibleFraction: 2 },
    { existingCredit: -1 },
    { requiredCredit: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
