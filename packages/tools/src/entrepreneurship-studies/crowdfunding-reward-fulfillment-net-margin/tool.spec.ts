import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("entrepreneurship-studies/crowdfunding-reward-fulfillment-net-margin", () => {
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
        pledges: 5000,
        platformFraction: 0.1,
        rewards: 50,
        unitCost: 50,
        shippingPerReward: 5,
        fixedCost: 500,
      }),
    ).toEqual({
      ok: true,
      output: { netProceeds: 4500, fulfillmentCost: 3250, surplus: 1250 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite pledges", (value) =>
    expect(tool.execute({ ...example.input, pledges: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite platformFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, platformFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rewards", (value) =>
    expect(tool.execute({ ...example.input, rewards: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite unitCost", (value) =>
    expect(tool.execute({ ...example.input, unitCost: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite shippingPerReward",
    (value) =>
      expect(
        tool.execute({ ...example.input, shippingPerReward: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite fixedCost", (value) =>
    expect(tool.execute({ ...example.input, fixedCost: value }).ok).toBe(false),
  );
  it.each([
    { pledges: -1 },
    { platformFraction: -1 },
    { platformFraction: 2 },
    { rewards: -1 },
    { unitCost: -1 },
    { shippingPerReward: -1 },
    { fixedCost: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
