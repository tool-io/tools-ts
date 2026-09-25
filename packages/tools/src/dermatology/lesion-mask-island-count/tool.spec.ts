import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("dermatology/lesion-mask-island-count", () => {
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
        mask: [
          [1, 0],
          [0, 1],
        ],
        eightConnected: true,
      }),
    ).toEqual({ ok: true, output: { islands: 1, foregroundPixels: 2 } });
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

  it.each([{ mask: [[2]] }, { mask: [[1], [1, 0]] }])(
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
  it.each([{ mask: [[2]] }, { mask: [[1], [1, 0]] }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("nested finite mask validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, mask: [[value]] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "mask" }],
        },
      });
    },
  );
});

describe("independently reviewed regressions", () => {
  it("an empty supplied mask has no islands", () => {
    const output = calculate({ mask: [], eightConnected: false });
    expect(output).toMatchObject({ islands: 0, foregroundPixels: 0 });
    expect(tool.execute({ mask: [], eightConnected: false })).toEqual({
      ok: true,
      output,
    });
  });
  it("a connected foreground ring is one island", () => {
    const output = calculate({
      mask: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
      eightConnected: false,
    });
    expect(output).toMatchObject({ islands: 1, foregroundPixels: 8 });
    expect(
      tool.execute({
        mask: [
          [1, 1, 1],
          [1, 0, 1],
          [1, 1, 1],
        ],
        eightConnected: false,
      }),
    ).toEqual({ ok: true, output });
  });
  it("rejects ragged research masks with the mask field", () => {
    expect(
      tool.execute({ mask: [[1], [1, 0]], eightConnected: false }),
    ).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "mask" }],
      },
    });
    expect(() =>
      calculate({ mask: [[1], [1, 0]], eightConnected: false }),
    ).toThrow();
  });
});
