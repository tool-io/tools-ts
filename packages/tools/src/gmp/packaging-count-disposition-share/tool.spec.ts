import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("gmp/packaging-count-disposition-share", () => {
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
      tool.execute({ dispositionCounts: [0, 0], requestedIndex: 1 }),
    ).toEqual({
      ok: true,
      output: { totalDecimal: "0", share: 0, defined: false },
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
    "rejects nonfinite requestedIndex",
    (value) =>
      expect(tool.execute({ ...example.input, requestedIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ requestedIndex: 2 }, { requestedIndex: -1 }])(
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
  it.each([{ requestedIndex: 2 }, { requestedIndex: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("nested finite dispositionCounts validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, dispositionCounts: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "dispositionCounts" }],
        },
      });
    },
  );
});

describe("independently reviewed regressions", () => {
  it("keeps an exact total beyond safe Number integers", () => {
    const output = calculate({
      dispositionCounts: [9007199254740991, 9007199254740991],
      requestedIndex: 1,
    });
    expect(output).toMatchObject({
      totalDecimal: "18014398509481982",
      share: 0.5,
      defined: true,
    });
    expect(
      tool.execute({
        dispositionCounts: [9007199254740991, 9007199254740991],
        requestedIndex: 1,
      }),
    ).toEqual({ ok: true, output });
  });
  it("marks an all-zero disposition total undefined", () => {
    const output = calculate({ dispositionCounts: [0, 0], requestedIndex: 0 });
    expect(output).toMatchObject({
      totalDecimal: "0",
      share: 0,
      defined: false,
    });
    expect(
      tool.execute({ dispositionCounts: [0, 0], requestedIndex: 0 }),
    ).toEqual({ ok: true, output });
  });
});
