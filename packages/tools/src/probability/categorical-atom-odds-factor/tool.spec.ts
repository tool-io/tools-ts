import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("probability/categorical-atom-odds-factor", () => {
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
    expect(tool.execute({ masses: [0, 2], selected: 0 })).toEqual({
      ok: true,
      output: { normalizedProbability: 0, odds: 0 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite selected", (value) =>
    expect(tool.execute({ ...example.input, selected: value }).ok).toBe(false),
  );
  it.each([
    { masses: [0, 0], selected: 0 },
    { masses: [1], selected: 0 },
    { selected: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { masses: [0, 0], selected: 0 },
    { masses: [1], selected: 0 },
    { selected: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("nested finite masses validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, masses: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "masses" }],
        },
      });
    },
  );
});

describe("independently reviewed regressions", () => {
  it("normalizes categorical masses whose ordinary sum overflows", () => {
    const output = calculate({ masses: [1e308, 1e308, 1e308], selected: 0 });
    expect(output).toMatchObject({
      normalizedProbability: 0.3333333333333333,
      odds: 0.5,
    });
    expect(
      tool.execute({ masses: [1e308, 1e308, 1e308], selected: 0 }),
    ).toEqual({ ok: true, output });
  });
});
