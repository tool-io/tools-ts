import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("statistics/zscore-zero-spread-policy", () => {
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
        value: 5,
        center: 5,
        spread: 0,
        zeroPolicy: "report-undefined",
      }),
    ).toEqual({ ok: true, output: { defined: false, zscore: 0 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite value", (value) =>
    expect(tool.execute({ ...example.input, value: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite center", (value) =>
    expect(tool.execute({ ...example.input, center: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite spread", (value) =>
    expect(tool.execute({ ...example.input, spread: value }).ok).toBe(false),
  );
  it.each([
    { spread: 0, zeroPolicy: "reject" },
    { zeroPolicy: "__invalid_enum__" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { spread: 0, zeroPolicy: "reject" },
    { zeroPolicy: "__invalid_enum__" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch75 review regressions
it("distinguishes a defined zero from undefined zero spread", () => {
  expect(
    calculate({ value: 3, center: 3, spread: 2, zeroPolicy: "reject" }),
  ).toEqual({ defined: true, zscore: 0 });
  expect(
    calculate({
      value: 3,
      center: 3,
      spread: 0,
      zeroPolicy: "report-undefined",
    }),
  ).toEqual({ defined: false, zscore: 0 });
  expect(
    tool.execute({ value: 3, center: 3, spread: 0, zeroPolicy: "reject" }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_domain", field: "spread" }] },
  });
});
