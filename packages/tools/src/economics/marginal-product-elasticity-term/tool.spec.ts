import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("economics/marginal-product-elasticity-term", () => {
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
        inputQuantity: 0,
        outputQuantity: 20,
        suppliedMarginalProduct: 3,
      }),
    ).toEqual({ ok: true, output: { elasticity: 0 } });
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
    "rejects nonfinite inputQuantity",
    (value) =>
      expect(tool.execute({ ...example.input, inputQuantity: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite outputQuantity",
    (value) =>
      expect(tool.execute({ ...example.input, outputQuantity: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedMarginalProduct",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedMarginalProduct: value }).ok,
      ).toBe(false),
  );
  it.each([{ inputQuantity: -1 }, { outputQuantity: 0 }])(
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
  it.each([{ inputQuantity: -1 }, { outputQuantity: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("retains finite elasticity when a product would overflow", () => {
    const output = calculate({
      inputQuantity: 1e308,
      outputQuantity: 1e308,
      suppliedMarginalProduct: 1e308,
    });
    expect(output).toMatchObject({ elasticity: 1e308 });
    expect(
      tool.execute({
        inputQuantity: 1e308,
        outputQuantity: 1e308,
        suppliedMarginalProduct: 1e308,
      }),
    ).toEqual({ ok: true, output });
  });
  it("retains finite elasticity when a product would underflow", () => {
    const output = calculate({
      inputQuantity: 1e-308,
      outputQuantity: 1e-308,
      suppliedMarginalProduct: 1e-308,
    });
    expect(output).toMatchObject({ elasticity: 1e-308 });
    expect(
      tool.execute({
        inputQuantity: 1e-308,
        outputQuantity: 1e-308,
        suppliedMarginalProduct: 1e-308,
      }),
    ).toEqual({ ok: true, output });
  });
});
