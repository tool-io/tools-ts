import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-linguistics/word-alignment-pair-token", () => {
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
      tool.execute({ sourceIndex: 0, targetIndex: 3, inputIsOneBased: false }),
    ).toEqual({ ok: true, output: { zeroBasedToken: "0-3" } });
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
    "rejects nonfinite sourceIndex",
    (value) =>
      expect(tool.execute({ ...example.input, sourceIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetIndex",
    (value) =>
      expect(tool.execute({ ...example.input, targetIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ sourceIndex: -1 }, { targetIndex: -1 }])(
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
  it.each([{ sourceIndex: -1 }, { targetIndex: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 76 reviewed regressions", () => {
  it("accepts zero-based token zero", () => {
    expect(
      calculate({ sourceIndex: 0, targetIndex: 0, inputIsOneBased: false }),
    ).toEqual({ zeroBasedToken: "0-0" });
  });
  it("rejects token zero in the one-based convention", () => {
    expect(
      tool.execute({ sourceIndex: 0, targetIndex: 1, inputIsOneBased: true }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "sourceIndex", code: "invalid_domain" }] },
    });
  });
});
