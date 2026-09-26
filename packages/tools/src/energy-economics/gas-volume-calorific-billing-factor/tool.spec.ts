import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("energy-economics/gas-volume-calorific-billing-factor", () => {
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
        meteredVolume: 50,
        correctionFactor: 1,
        calorificMjPerVolume: 39.6,
        pricePerKwh: 0.2,
      }),
    ).toEqual({
      ok: true,
      output: { correctedVolume: 50, kwh: 550, cost: 110 },
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
    "rejects nonfinite meteredVolume",
    (value) =>
      expect(tool.execute({ ...example.input, meteredVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite correctionFactor",
    (value) =>
      expect(
        tool.execute({ ...example.input, correctionFactor: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite calorificMjPerVolume",
    (value) =>
      expect(
        tool.execute({ ...example.input, calorificMjPerVolume: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pricePerKwh",
    (value) =>
      expect(tool.execute({ ...example.input, pricePerKwh: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { meteredVolume: -1 },
    { correctionFactor: 0 },
    { calorificMjPerVolume: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });

  it.each([
    { meteredVolume: -1 },
    { correctionFactor: 0 },
    { calorificMjPerVolume: 0 },
  ])("reviewed-domain direct validation %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrow();
    const result = tool.execute({ ...example.input, ...change });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect([
        "invalid_field",
        "invalid_domain",
        "result_out_of_range",
      ]).toContain(result.error.issues[0].code);
  });
});
