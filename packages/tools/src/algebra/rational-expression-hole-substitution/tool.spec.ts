import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("algebra/rational-expression-hole-substitution", () => {
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
        reducedNumeratorAscending: [8, 2],
        reducedDenominatorAscending: [1, 1],
        excludedPoint: 2,
        evaluationPoint: 3,
      }),
    ).toEqual({
      ok: true,
      output: { value: 3.5, excludedPointEncountered: false },
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
    "rejects nonfinite excludedPoint",
    (value) =>
      expect(tool.execute({ ...example.input, excludedPoint: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite evaluationPoint",
    (value) =>
      expect(
        tool.execute({ ...example.input, evaluationPoint: value }).ok,
      ).toBe(false),
  );
  it.each([
    { reducedDenominatorAscending: [0] },
    { reducedNumeratorAscending: [] },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { reducedDenominatorAscending: [0] },
    { reducedNumeratorAscending: [] },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("nested finite reducedNumeratorAscending validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, reducedNumeratorAscending: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [
            { code: "invalid_field", field: "reducedNumeratorAscending" },
          ],
        },
      });
    },
  );
});

describe("nested finite reducedDenominatorAscending validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, reducedDenominatorAscending: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [
            { code: "invalid_field", field: "reducedDenominatorAscending" },
          ],
        },
      });
    },
  );
});

// batch75 review regressions
it("evaluates the extension and rejects a zero reduced denominator", () => {
  expect(
    calculate({
      reducedNumeratorAscending: [8, 2],
      reducedDenominatorAscending: [1, 1],
      excludedPoint: 2,
      evaluationPoint: 0,
    }),
  ).toEqual({ value: 8, excludedPointEncountered: false });
  expect(
    tool.execute({
      reducedNumeratorAscending: [8, 2],
      reducedDenominatorAscending: [-2, 1],
      excludedPoint: 2,
      evaluationPoint: 2,
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [
        { code: "invalid_domain", field: "reducedDenominatorAscending" },
      ],
    },
  });
});
