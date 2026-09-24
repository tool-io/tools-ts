import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("classification/ordinal-median-class-boundary", () => {
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
        orderedClasses: ["A", "B", "C"],
        probabilities: [0.5, 0.25, 0.25],
        equalityToLower: false,
      }),
    ).toEqual({
      ok: true,
      output: { classIndex: 1, classLabel: "B", cumulativeMass: 0.75 },
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

  it.each([{ probabilities: [0, 0, 0] }])(
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
  it.each([{ probabilities: [0, 0, 0] }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("nested finite probabilities validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, probabilities: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "probabilities" }],
        },
      });
    },
  );
});

describe("independently reviewed regressions", () => {
  it("explicit upper equality rule selects the following class", () => {
    const output = calculate({
      orderedClasses: ["A", "B", "C"],
      probabilities: [0.5, 0.25, 0.25],
      equalityToLower: false,
    });
    expect(output).toMatchObject({
      classIndex: 1,
      classLabel: "B",
      cumulativeMass: 0.75,
    });
    expect(
      tool.execute({
        orderedClasses: ["A", "B", "C"],
        probabilities: [0.5, 0.25, 0.25],
        equalityToLower: false,
      }),
    ).toEqual({ ok: true, output });
  });
});
