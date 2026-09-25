import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("demographic-economics/fertility-income-opportunity-cost-term", () => {
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
        foregoneHours: 80,
        hourlyEarnings: 15,
        retainedEarningsFraction: 0.5,
        childcareCost: 200,
        benefit: 0,
      }),
    ).toEqual({ ok: true, output: { foregoneIncome: 600, netCost: 800 } });
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
    "rejects nonfinite foregoneHours",
    (value) =>
      expect(tool.execute({ ...example.input, foregoneHours: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite hourlyEarnings",
    (value) =>
      expect(tool.execute({ ...example.input, hourlyEarnings: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite retainedEarningsFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, retainedEarningsFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite childcareCost",
    (value) =>
      expect(tool.execute({ ...example.input, childcareCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite benefit", (value) =>
    expect(tool.execute({ ...example.input, benefit: value }).ok).toBe(false),
  );
  it.each([
    { foregoneHours: -1 },
    { hourlyEarnings: -1 },
    { retainedEarningsFraction: -1 },
    { retainedEarningsFraction: 2 },
    { childcareCost: -1 },
    { benefit: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
