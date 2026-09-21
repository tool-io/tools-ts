import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("animal-science/milk-fat-protein-weighted-price-term", () => {
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
        milkMass: 80,
        fatFraction: 0.05,
        proteinFraction: 0.04,
        basePrice: 0.25,
        fatPrice: 2,
        proteinPrice: 2,
      }),
    ).toEqual({
      ok: true,
      output: { fatValue: 8, proteinValue: 6.4, totalValue: 34.4 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite milkMass", (value) =>
    expect(tool.execute({ ...example.input, milkMass: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fatFraction",
    (value) =>
      expect(tool.execute({ ...example.input, fatFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite proteinFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, proteinFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite basePrice", (value) =>
    expect(tool.execute({ ...example.input, basePrice: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite fatPrice", (value) =>
    expect(tool.execute({ ...example.input, fatPrice: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite proteinPrice",
    (value) =>
      expect(tool.execute({ ...example.input, proteinPrice: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { milkMass: -1 },
    { fatFraction: -1 },
    { fatFraction: 2 },
    { proteinFraction: -1 },
    { proteinFraction: 2 },
    { basePrice: -1 },
    { fatPrice: -1 },
    { proteinPrice: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
