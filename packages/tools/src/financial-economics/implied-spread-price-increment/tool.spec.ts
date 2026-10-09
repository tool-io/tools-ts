import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("financial-economics/implied-spread-price-increment", () => {
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
        spreadBasisPoints: -10,
        suppliedSpreadDurationYears: 2,
        price: 50,
      }),
    ).toEqual({ ok: true, output: { linearPriceChange: 0.1 } });
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
    "rejects nonfinite spreadBasisPoints",
    (value) =>
      expect(
        tool.execute({ ...example.input, spreadBasisPoints: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedSpreadDurationYears",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedSpreadDurationYears: value })
          .ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite price", (value) =>
    expect(tool.execute({ ...example.input, price: value }).ok).toBe(false),
  );
});

describe("batch 77 contract refinements", () => {
  it("accepts an explicit signed spread-duration sensitivity", () => {
    expect(
      calculate({
        spreadBasisPoints: 10,
        suppliedSpreadDurationYears: -2,
        price: 100,
      }),
    ).toEqual({ linearPriceChange: 0.2 });
  });
});
