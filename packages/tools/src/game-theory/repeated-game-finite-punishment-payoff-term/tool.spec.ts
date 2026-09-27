import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("game-theory/repeated-game-finite-punishment-payoff-term", () => {
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
        cooperatePayoff: 3,
        deviationPayoff: 5,
        punishmentPayoff: 1,
        discount: 1,
        punishmentPeriods: 2,
      }),
    ).toEqual({
      ok: true,
      output: { deviationGain: 2, discountedPunishmentLoss: 4, deters: true },
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
    "rejects nonfinite cooperatePayoff",
    (value) =>
      expect(
        tool.execute({ ...example.input, cooperatePayoff: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite deviationPayoff",
    (value) =>
      expect(
        tool.execute({ ...example.input, deviationPayoff: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite punishmentPayoff",
    (value) =>
      expect(
        tool.execute({ ...example.input, punishmentPayoff: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite discount", (value) =>
    expect(tool.execute({ ...example.input, discount: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite punishmentPeriods",
    (value) =>
      expect(
        tool.execute({ ...example.input, punishmentPeriods: value }).ok,
      ).toBe(false),
  );
  it.each([{ discount: -1 }, { discount: 2 }, { punishmentPeriods: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});
