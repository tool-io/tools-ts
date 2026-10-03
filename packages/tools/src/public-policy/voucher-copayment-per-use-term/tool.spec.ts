import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("public-policy/voucher-copayment-per-use-term", () => {
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
      tool.execute({ uses: 5, pricePerUse: 10, voucherPerUse: 15 }),
    ).toEqual({
      ok: true,
      output: { subsidy: 50, householdCost: 0, totalCost: 50 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite uses", (value) =>
    expect(tool.execute({ ...example.input, uses: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pricePerUse",
    (value) =>
      expect(tool.execute({ ...example.input, pricePerUse: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite voucherPerUse",
    (value) =>
      expect(tool.execute({ ...example.input, voucherPerUse: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ uses: -1 }, { pricePerUse: -1 }, { voucherPerUse: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});
