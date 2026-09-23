import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("business-analytics/sales-territory-transfer-credit-split", () => {
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
        saleValue: 800,
        originalFraction: 0.5,
        receivingFraction: 0.5,
        unallocatedFraction: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        originalCredit: 400,
        receivingCredit: 400,
        unallocatedCredit: 0,
      },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite saleValue", (value) =>
    expect(tool.execute({ ...example.input, saleValue: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite originalFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, originalFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite receivingFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, receivingFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite unallocatedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, unallocatedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { saleValue: -1 },
    { originalFraction: -1 },
    { originalFraction: 2 },
    { receivingFraction: -1 },
    { receivingFraction: 2 },
    { unallocatedFraction: -1 },
    { unallocatedFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
