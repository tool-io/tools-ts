import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("consumer-behavior/reference-price-return-adjustment", () => {
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
        perceivedReference: 60,
        purchaseValue: 50,
        explicitRefund: 10,
        returnedQuantity: 1,
        originalQuantity: 3,
      }),
    ).toEqual({ ok: true, output: { netPaid: 40, referenceOnRetained: 40 } });
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
    "rejects nonfinite perceivedReference",
    (value) =>
      expect(
        tool.execute({ ...example.input, perceivedReference: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite purchaseValue",
    (value) =>
      expect(tool.execute({ ...example.input, purchaseValue: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite explicitRefund",
    (value) =>
      expect(tool.execute({ ...example.input, explicitRefund: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite returnedQuantity",
    (value) =>
      expect(
        tool.execute({ ...example.input, returnedQuantity: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite originalQuantity",
    (value) =>
      expect(
        tool.execute({ ...example.input, originalQuantity: value }).ok,
      ).toBe(false),
  );
  it.each([
    { perceivedReference: -1 },
    { purchaseValue: -1 },
    { explicitRefund: -1 },
    { returnedQuantity: -1 },
    { originalQuantity: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { perceivedReference: -1 },
    { purchaseValue: -1 },
    { explicitRefund: -1 },
    { returnedQuantity: -1 },
    { originalQuantity: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
