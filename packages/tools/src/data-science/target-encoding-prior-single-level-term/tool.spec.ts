import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("data-science/target-encoding-prior-single-level-term", () => {
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
        levelTargetSum: 0,
        levelCount: 0,
        priorMean: 3,
        priorWeight: 2,
      }),
    ).toEqual({ ok: true, output: { smoothedEncoding: 3 } });
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
    "rejects nonfinite levelTargetSum",
    (value) =>
      expect(tool.execute({ ...example.input, levelTargetSum: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite levelCount", (value) =>
    expect(tool.execute({ ...example.input, levelCount: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite priorMean", (value) =>
    expect(tool.execute({ ...example.input, priorMean: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite priorWeight",
    (value) =>
      expect(tool.execute({ ...example.input, priorWeight: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ levelCount: -1 }, { priorWeight: -1 }])(
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
  it.each([{ levelCount: -1 }, { priorWeight: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ levelTargetSum: 0, levelCount: 0, priorMean: 2.5, priorWeight: 4 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { smoothedEncoding: 2.5 },
    });
    expect(calculate(input)).toEqual({ smoothedEncoding: 2.5 });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ levelCount: 0, priorWeight: 0 } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "priorWeight", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
