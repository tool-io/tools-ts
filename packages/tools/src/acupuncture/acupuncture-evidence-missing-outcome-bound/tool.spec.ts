import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("acupuncture/acupuncture-evidence-missing-outcome-bound", () => {
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
        observedSuccess: 10,
        observedTotal: 40,
        missing: 10,
        lowerMissingRate: 0.2,
        upperMissingRate: 0.8,
      }),
    ).toEqual({ ok: true, output: { lowerRate: 0.24, upperRate: 0.36 } });
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
    "rejects nonfinite observedSuccess",
    (value) =>
      expect(
        tool.execute({ ...example.input, observedSuccess: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observedTotal",
    (value) =>
      expect(tool.execute({ ...example.input, observedTotal: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite missing", (value) =>
    expect(tool.execute({ ...example.input, missing: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite lowerMissingRate",
    (value) =>
      expect(
        tool.execute({ ...example.input, lowerMissingRate: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite upperMissingRate",
    (value) =>
      expect(
        tool.execute({ ...example.input, upperMissingRate: value }).ok,
      ).toBe(false),
  );
  it.each([
    { observedSuccess: -1 },
    { observedTotal: 0 },
    { missing: -1 },
    { lowerMissingRate: -1 },
    { lowerMissingRate: 2 },
    { upperMissingRate: -1 },
    { upperMissingRate: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { observedSuccess: -1 },
    { observedTotal: 0 },
    { missing: -1 },
    { lowerMissingRate: -1 },
    { lowerMissingRate: 2 },
    { upperMissingRate: -1 },
    { upperMissingRate: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
