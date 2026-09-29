import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-business/export-payment-fx-fee-net-term", () => {
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
        foreignReceipt: 5000,
        foreignFixedFee: 0,
        domesticPerForeign: 0.8,
        percentFee: 0.02,
        domesticFee: 10,
      }),
    ).toEqual({
      ok: true,
      output: { convertedGross: 4000, domesticNet: 3910 },
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
    "rejects nonfinite foreignReceipt",
    (value) =>
      expect(tool.execute({ ...example.input, foreignReceipt: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite foreignFixedFee",
    (value) =>
      expect(
        tool.execute({ ...example.input, foreignFixedFee: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite domesticPerForeign",
    (value) =>
      expect(
        tool.execute({ ...example.input, domesticPerForeign: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite percentFee", (value) =>
    expect(tool.execute({ ...example.input, percentFee: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite domesticFee",
    (value) =>
      expect(tool.execute({ ...example.input, domesticFee: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { foreignFixedFee: -1 },
    { domesticPerForeign: 0 },
    { percentFee: -1 },
    { percentFee: 2 },
    { domesticFee: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { foreignFixedFee: -1 },
    { domesticPerForeign: 0 },
    { percentFee: -1 },
    { percentFee: 2 },
    { domesticFee: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
