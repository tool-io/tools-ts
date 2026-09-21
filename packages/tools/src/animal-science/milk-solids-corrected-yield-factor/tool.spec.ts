import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("animal-science/milk-solids-corrected-yield-factor", () => {
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
        fatFraction: 0.03,
        proteinFraction: 0.04,
        referenceFat: 0.03,
        referenceProtein: 0.03,
        fatCoefficient: 10,
        proteinCoefficient: 5,
      }),
    ).toEqual({ ok: true, output: { correctedYield: 84 } });
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceFat",
    (value) =>
      expect(tool.execute({ ...example.input, referenceFat: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceProtein",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceProtein: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fatCoefficient",
    (value) =>
      expect(tool.execute({ ...example.input, fatCoefficient: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite proteinCoefficient",
    (value) =>
      expect(
        tool.execute({ ...example.input, proteinCoefficient: value }).ok,
      ).toBe(false),
  );
  it.each([
    { milkMass: -1 },
    { fatFraction: -1 },
    { fatFraction: 2 },
    { proteinFraction: -1 },
    { proteinFraction: 2 },
    { referenceFat: -1 },
    { referenceFat: 2 },
    { referenceProtein: -1 },
    { referenceProtein: 2 },
    { fatCoefficient: -1 },
    { proteinCoefficient: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
