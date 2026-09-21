import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agroecology/legume-residue-nitrogen-supplied-factor", () => {
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
        dryMass: 800,
        nitrogenFraction: 0.025,
        mineralizedFraction: 0.4,
        recoveredFraction: 0.5,
      }),
    ).toEqual({ ok: true, output: { nitrogenMass: 20, availableNitrogen: 4 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite dryMass", (value) =>
    expect(tool.execute({ ...example.input, dryMass: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite nitrogenFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, nitrogenFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite mineralizedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, mineralizedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recoveredFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, recoveredFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { dryMass: -1 },
    { nitrogenFraction: -1 },
    { nitrogenFraction: 2 },
    { mineralizedFraction: -1 },
    { mineralizedFraction: 2 },
    { recoveredFraction: -1 },
    { recoveredFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
