import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  salaryComparisonExample as example,
  calculateSalaryComparison,
} from "./tool.js";

describe("Gross Salary and Effective Hourly Pay Comparison Tool", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateSalaryComparison(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
  });
  it("uses caller-supplied working time rather than an implicit 2,080-hour year", () => {
    const result = tool.execute({
      currency: "USD",
      first: {
        annualBasePay: 48000,
        annualBonus: 0,
        weeklyHours: 20,
        paidWeeksPerYear: 48,
      },
      second: {
        annualBasePay: 48000,
        annualBonus: -9600,
        weeklyHours: 40,
        paidWeeksPerYear: 48,
      },
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.first.effectiveHourlyPay).toBe(50);
    expect(result.output.second.effectiveHourlyPay).toBe(20);
    expect(result.output.annualGrossDifference).toBe(-9600);
    expect(result.output.hourlyPayDifference).toBe(-30);
  });
  it("permits zero pay and bonus clawbacks but rejects undefined hourly rates and overflow", () => {
    const zero = tool.execute({
      ...example.input,
      first: { ...example.input.first, annualBasePay: 0, annualBonus: 0 },
    });
    if (!zero.ok) throw new Error("Expected success");
    expect(zero.output.first.effectiveHourlyPay).toBe(0);
    expect(
      tool.execute({
        ...example.input,
        first: { ...example.input.first, weeklyHours: 0 },
      }),
    ).toMatchObject({ ok: false, error: { issues: [{ field: "first" }] } });
    expect(
      tool.execute({
        ...example.input,
        second: {
          ...example.input.second,
          annualBasePay: 1e308,
          annualBonus: 1e308,
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "second", code: "numeric_overflow" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        first: {
          ...example.input.first,
          weeklyHours: Number.MIN_VALUE,
          paidWeeksPerYear: Number.MIN_VALUE,
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "first", code: "numeric_overflow" }] },
    });
  });
});
