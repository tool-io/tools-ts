import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("neuroscience/median-frequency-eeg", () => {
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
      tool.execute({ frequenciesHz: [0, 5, 10], binPowers: [2, 2, 0] }),
    ).toEqual({ ok: true, output: { medianFrequencyHz: 0, binIndex: 0 } });
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

  it.each([
    { frequenciesHz: [], binPowers: [] },
    { binPowers: [0, 0, 0, 0] },
    { frequenciesHz: [1, 1, 4, 8] },
    { binPowers: [1, -1, 5, 2] },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { frequenciesHz: [], binPowers: [] },
    { binPowers: [0, 0, 0, 0] },
    { frequenciesHz: [1, 1, 4, 8] },
    { binPowers: [1, -1, 5, 2] },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("nested finite frequenciesHz validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, frequenciesHz: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "frequenciesHz" }],
        },
      });
    },
  );
});

describe("nested finite binPowers validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, binPowers: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "binPowers" }],
        },
      });
    },
  );
});

// batch75 review regressions
it("scales large powers and names a zero-power failure", () => {
  expect(
    calculate({ frequenciesHz: [1, 2, 3], binPowers: [1e308, 1e308, 0] }),
  ).toEqual({ medianFrequencyHz: 1, binIndex: 0 });
  expect(
    tool.execute({ frequenciesHz: [1, 2], binPowers: [0, 0] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_domain", field: "binPowers" }] },
  });
});
