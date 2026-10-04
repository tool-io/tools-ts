import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("algebra/polynomial-missing-degree-padding", () => {
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
      tool.execute({ degrees: [0], coefficients: [5], maximumDegree: 0 }),
    ).toEqual({ ok: true, output: { ascendingCoefficients: [5] } });
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
    "rejects nonfinite maximumDegree",
    (value) =>
      expect(tool.execute({ ...example.input, maximumDegree: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { degrees: [3, 3, 1] },
    { maximumDegree: 2 },
    { degrees: [3, 0] },
    { maximumDegree: -1 },
    { maximumDegree: 256 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { degrees: [3, 3, 1] },
    { maximumDegree: 2 },
    { degrees: [3, 0] },
    { maximumDegree: -1 },
    { maximumDegree: 256 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("nested finite degrees validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, degrees: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "degrees" }],
        },
      });
    },
  );
});

describe("nested finite coefficients validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, coefficients: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "coefficients" }],
        },
      });
    },
  );
});

// batch75 review regressions
it("pads the zero polynomial and rejects duplicate keys", () => {
  expect(
    calculate({ degrees: [], coefficients: [], maximumDegree: 2 }),
  ).toEqual({ ascendingCoefficients: [0, 0, 0] });
  expect(
    tool.execute({ degrees: [1, 1], coefficients: [3, 4], maximumDegree: 2 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_domain", field: "degrees" }] },
  });
});
