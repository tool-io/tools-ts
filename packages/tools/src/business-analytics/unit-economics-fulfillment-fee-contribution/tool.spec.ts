import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("business-analytics/unit-economics-fulfillment-fee-contribution", () => {
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
        netPrice: 80,
        goodsCost: 50,
        fulfillmentFixed: 4,
        fulfillmentPercent: 0.05,
        paymentFee: 2,
      }),
    ).toEqual({ ok: true, output: { fulfillmentCost: 8, contribution: 20 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite netPrice", (value) =>
    expect(tool.execute({ ...example.input, netPrice: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite goodsCost", (value) =>
    expect(tool.execute({ ...example.input, goodsCost: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fulfillmentFixed",
    (value) =>
      expect(
        tool.execute({ ...example.input, fulfillmentFixed: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fulfillmentPercent",
    (value) =>
      expect(
        tool.execute({ ...example.input, fulfillmentPercent: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite paymentFee", (value) =>
    expect(tool.execute({ ...example.input, paymentFee: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { netPrice: -1 },
    { goodsCost: -1 },
    { fulfillmentFixed: -1 },
    { fulfillmentPercent: -1 },
    { fulfillmentPercent: 2 },
    { paymentFee: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
