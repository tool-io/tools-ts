import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("business-analytics/subscription-seat-expansion-proration-term", () => {
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
        oldSeats: 12,
        newSeats: 8,
        unitPeriodPrice: 30,
        remainingDays: 10,
        periodDays: 30,
      }),
    ).toEqual({ ok: true, output: { seatChange: -4, proratedChange: -40 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite oldSeats", (value) =>
    expect(tool.execute({ ...example.input, oldSeats: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite newSeats", (value) =>
    expect(tool.execute({ ...example.input, newSeats: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite unitPeriodPrice",
    (value) =>
      expect(
        tool.execute({ ...example.input, unitPeriodPrice: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite remainingDays",
    (value) =>
      expect(tool.execute({ ...example.input, remainingDays: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite periodDays", (value) =>
    expect(tool.execute({ ...example.input, periodDays: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { oldSeats: -1 },
    { newSeats: -1 },
    { unitPeriodPrice: -1 },
    { remainingDays: -1 },
    { periodDays: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
