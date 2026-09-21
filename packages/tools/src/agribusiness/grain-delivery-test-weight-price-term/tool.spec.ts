import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agribusiness/grain-delivery-test-weight-price-term", () => {
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
        quantity: 50,
        baseUnitPrice: 30,
        measuredTestWeight: 72,
        referenceTestWeight: 75,
        pricePerWeightPoint: 1,
      }),
    ).toEqual({
      ok: true,
      output: { unitAdjustment: -3, adjustedUnitPrice: 27, total: 1350 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite quantity", (value) =>
    expect(tool.execute({ ...example.input, quantity: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite baseUnitPrice",
    (value) =>
      expect(tool.execute({ ...example.input, baseUnitPrice: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite measuredTestWeight",
    (value) =>
      expect(
        tool.execute({ ...example.input, measuredTestWeight: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceTestWeight",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceTestWeight: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pricePerWeightPoint",
    (value) =>
      expect(
        tool.execute({ ...example.input, pricePerWeightPoint: value }).ok,
      ).toBe(false),
  );
  it.each([
    { quantity: -1 },
    { baseUnitPrice: -1 },
    { measuredTestWeight: -1 },
    { referenceTestWeight: -1 },
    { pricePerWeightPoint: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
