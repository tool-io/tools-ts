import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-economics/quota-rent-denominator-gap", () => {
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
        totalRent: 200,
        allocatedQuantity: 100,
        importedQuantity: 80,
        useAllocated: false,
      }),
    ).toEqual({ ok: true, output: { rentPerUnit: 2.5, denominatorGap: 20 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite totalRent", (value) =>
    expect(tool.execute({ ...example.input, totalRent: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite allocatedQuantity",
    (value) =>
      expect(
        tool.execute({ ...example.input, allocatedQuantity: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite importedQuantity",
    (value) =>
      expect(
        tool.execute({ ...example.input, importedQuantity: value }).ok,
      ).toBe(false),
  );
  it.each([{ allocatedQuantity: 0 }, { importedQuantity: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ allocatedQuantity: 0 }, { importedQuantity: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});
