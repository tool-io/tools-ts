import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agribusiness/cooperative-member-patronage-share-term", () => {
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
        memberEligibleTrade: 200,
        totalEligibleTrade: 800,
        distributableSurplus: 400,
        retainedFraction: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { share: 0.25, allocated: 100, cashPaid: 50, retained: 50 },
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
    "rejects nonfinite memberEligibleTrade",
    (value) =>
      expect(
        tool.execute({ ...example.input, memberEligibleTrade: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite totalEligibleTrade",
    (value) =>
      expect(
        tool.execute({ ...example.input, totalEligibleTrade: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite distributableSurplus",
    (value) =>
      expect(
        tool.execute({ ...example.input, distributableSurplus: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite retainedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, retainedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { memberEligibleTrade: -1 },
    { totalEligibleTrade: 0 },
    { distributableSurplus: -1 },
    { retainedFraction: -1 },
    { retainedFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
