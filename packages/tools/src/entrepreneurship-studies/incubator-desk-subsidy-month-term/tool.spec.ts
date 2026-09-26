import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("entrepreneurship-studies/incubator-desk-subsidy-month-term", () => {
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
        desks: 2,
        months: 12,
        marketMonthlyRate: 200,
        subsidizedMonthlyRate: 50,
        occupancyFraction: 1,
      }),
    ).toEqual({ ok: true, output: { deskMonths: 24, subsidyValue: 3600 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite desks", (value) =>
    expect(tool.execute({ ...example.input, desks: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite months", (value) =>
    expect(tool.execute({ ...example.input, months: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite marketMonthlyRate",
    (value) =>
      expect(
        tool.execute({ ...example.input, marketMonthlyRate: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite subsidizedMonthlyRate",
    (value) =>
      expect(
        tool.execute({ ...example.input, subsidizedMonthlyRate: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite occupancyFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, occupancyFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { desks: -1 },
    { months: -1 },
    { marketMonthlyRate: -1 },
    { subsidizedMonthlyRate: -1 },
    { occupancyFraction: -1 },
    { occupancyFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
