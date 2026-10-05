import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("format/currency-negative-accounting-label", () => {
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
      tool.execute({ decimalAmount: "-0.00", currencyToken: "USD " }),
    ).toEqual({ ok: true, output: { label: "USD 0.00" } });
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

  it.each([{ decimalAmount: "1,000" }, { currencyToken: "" }])(
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
  it.each([{ decimalAmount: "1,000" }, { currencyToken: "" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

// batch75 review regressions
it("preserves cents and rejects final newlines", () => {
  expect(calculate({ decimalAmount: "-0.000", currencyToken: "USD " })).toEqual(
    { label: "USD 0.000" },
  );
  expect(calculate({ decimalAmount: "-12.0500", currencyToken: "$" })).toEqual({
    label: "($12.0500)",
  });
  for (const decimalAmount of ["12.50\n", "1,200", "1e3"])
    expect(tool.execute({ decimalAmount, currencyToken: "$" })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_domain", field: "decimalAmount" }] },
    });
});
