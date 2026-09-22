import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biobanking/biobank-specimen-label-check-symbol", () => {
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
        label: "24",
        alphabet: "0123456789",
        weights: [1, 1],
        modulus: 10,
      }),
    ).toEqual({ ok: true, output: { checkIndex: 4, checkSymbol: "4" } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite modulus", (value) =>
    expect(tool.execute({ ...example.input, modulus: value }).ok).toBe(false),
  );
  it.each([
    { alphabet: "0012" },
    { alphabet: "01🧤" },
    { weights: [1] },
    { modulus: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { alphabet: "0012" },
    { alphabet: "01🧤" },
    { weights: [1] },
    { modulus: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 68 regression review

it("keeps a weighted checksum exact beyond safe intermediate products", () => {
  expect(
    calculate({
      label: "99",
      alphabet: "0123456789",
      weights: [9007199254740991, 1],
      modulus: 10,
    }),
  ).toEqual({ checkIndex: 2, checkSymbol: "2" });
});
