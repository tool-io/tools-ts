import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("dietetics/meal-fat-energy-share-term", () => {
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
      tool.execute({ fatGrams: 10, energyPerFatGram: 8, totalEnergy: 400 }),
    ).toEqual({ ok: true, output: { fatEnergy: 80, fraction: 0.2 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite fatGrams", (value) =>
    expect(tool.execute({ ...example.input, fatGrams: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite energyPerFatGram",
    (value) =>
      expect(
        tool.execute({ ...example.input, energyPerFatGram: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite totalEnergy",
    (value) =>
      expect(tool.execute({ ...example.input, totalEnergy: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ fatGrams: -1 }, { energyPerFatGram: -1 }, { totalEnergy: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});
