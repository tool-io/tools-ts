import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("marketing/customer-cohort-age-index", () => {
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
        cohortYear: 2026,
        cohortMonth: 10,
        observationYear: 2026,
        observationMonth: 10,
      }),
    ).toEqual({ ok: true, output: { ageMonths: 0 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cohortYear", (value) =>
    expect(tool.execute({ ...example.input, cohortYear: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cohortMonth",
    (value) =>
      expect(tool.execute({ ...example.input, cohortMonth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observationYear",
    (value) =>
      expect(
        tool.execute({ ...example.input, observationYear: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observationMonth",
    (value) =>
      expect(
        tool.execute({ ...example.input, observationMonth: value }).ok,
      ).toBe(false),
  );
  it.each([
    { cohortYear: 0 },
    { cohortYear: 10000 },
    { cohortMonth: 0 },
    { cohortMonth: 13 },
    { observationYear: 0 },
    { observationYear: 10000 },
    { observationMonth: 0 },
    { observationMonth: 13 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { cohortYear: 0 },
    { cohortYear: 10000 },
    { cohortMonth: 0 },
    { cohortMonth: 13 },
    { observationYear: 0 },
    { observationYear: 10000 },
    { observationMonth: 0 },
    { observationMonth: 13 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
