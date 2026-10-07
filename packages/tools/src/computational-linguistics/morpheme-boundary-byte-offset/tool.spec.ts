import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-linguistics/morpheme-boundary-byte-offset", () => {
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
    expect(tool.execute({ morphemes: ["a"], boundaryIndex: 0 })).toEqual({
      ok: true,
      output: { utf8ByteOffset: 0, precedingMorphemeCount: 0 },
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
    "rejects nonfinite boundaryIndex",
    (value) =>
      expect(tool.execute({ ...example.input, boundaryIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ boundaryIndex: -1 }])(
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
  it.each([{ boundaryIndex: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 76 reviewed regressions", () => {
  it("counts a supplementary scalar as four UTF-8 octets", () => {
    expect(
      calculate({ morphemes: ["😀", "é", "x"], boundaryIndex: 2 }),
    ).toEqual({ utf8ByteOffset: 6, precedingMorphemeCount: 2 });
  });
  it("allows the terminal boundary", () => {
    expect(calculate({ morphemes: ["a", "b"], boundaryIndex: 2 })).toEqual({
      utf8ByteOffset: 2,
      precedingMorphemeCount: 2,
    });
  });
  it("rejects an isolated surrogate rather than silently replacing it", () => {
    expect(
      tool.execute({ morphemes: ["\ud800"], boundaryIndex: 1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "morphemes", code: "invalid_domain" }] },
    });
  });
});
