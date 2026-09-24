import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-linguistics/subword-token-byte-offset", () => {
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
    expect(tool.execute({ tokens: ["a", "bc"], tokenIndex: 1 })).toEqual({
      ok: true,
      output: { startByte: 1, endByte: 3 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tokenIndex", (value) =>
    expect(tool.execute({ ...example.input, tokenIndex: value }).ok).toBe(
      false,
    ),
  );
  it.each([{ tokenIndex: 3 }, { tokenIndex: -1 }])(
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
  it.each([{ tokenIndex: 3 }, { tokenIndex: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

import { SimpleToolError as RegressionInputError } from "../../core/simple.js";

describe("batch 71 independent regressions", () => {
  it("counts complete multi-byte scalar tokens", () => {
    expect(calculate({ tokens: ["é", "🚀", "z"], tokenIndex: 1 })).toEqual({
      startByte: 2,
      endByte: 6,
    });
    expect(tool.execute({ tokens: ["é", "🚀", "z"], tokenIndex: 1 })).toEqual({
      ok: true,
      output: { startByte: 2, endByte: 6 },
    });
  });
  it("rejects a scalar split between token spellings", () => {
    const input = {
      ...example.input,
      ...{ tokens: ["\ud83d", "\ude80"], tokenIndex: 0 },
    };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "tokens" }],
      },
    });
    expect(() => calculate(input)).toThrowError(RegressionInputError);
  });
});
