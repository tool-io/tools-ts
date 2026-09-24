import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-chemistry/periodic-image-half-cell-tie-token", () => {
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
      tool.execute({ displacement: 5, cellLength: 10, tiePolicy: "positive" }),
    ).toEqual({ ok: true, output: { nearestDisplacement: 5, tied: true } });
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
    "rejects nonfinite displacement",
    (value) =>
      expect(tool.execute({ ...example.input, displacement: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cellLength", (value) =>
    expect(tool.execute({ ...example.input, cellLength: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { cellLength: 0 },
    { cellLength: 0 },
    { tiePolicy: "__invalid_enum__" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { cellLength: 0 },
    { cellLength: 0 },
    { tiePolicy: "__invalid_enum__" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 69 reviewed regressions

it("preserves the explicit half-cell sign after full-period shifts", () => {
  expect(
    calculate({ displacement: 25, cellLength: 10, tiePolicy: "negative" }),
  ).toEqual({ nearestDisplacement: -5, tied: true });
  expect(
    calculate({ displacement: -25, cellLength: 10, tiePolicy: "positive" }),
  ).toEqual({ nearestDisplacement: 5, tied: true });
});
