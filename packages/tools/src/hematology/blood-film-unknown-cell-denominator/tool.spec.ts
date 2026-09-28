import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("hematology/blood-film-unknown-cell-denominator", () => {
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
        recognized: 80,
        unknown: 20,
        excluded: 10,
        includeUnknown: false,
      }),
    ).toEqual({
      ok: true,
      output: { denominator: 80, unknownShare: 0.18181818181818182 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite recognized", (value) =>
    expect(tool.execute({ ...example.input, recognized: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite unknown", (value) =>
    expect(tool.execute({ ...example.input, unknown: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite excluded", (value) =>
    expect(tool.execute({ ...example.input, excluded: value }).ok).toBe(false),
  );
  it.each([{ recognized: -1 }, { unknown: -1 }, { excluded: -1 }])(
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
  it.each([{ recognized: -1 }, { unknown: -1 }, { excluded: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 70 independent regressions", () => {
  it("preserves a zero recognized denominator", () => {
    expect(
      calculate({
        recognized: 0,
        unknown: 5,
        excluded: 0,
        includeUnknown: false,
      }),
    ).toEqual({ denominator: 0, unknownShare: 1 });
    expect(
      tool.execute({
        recognized: 0,
        unknown: 5,
        excluded: 0,
        includeUnknown: false,
      }),
    ).toEqual({ ok: true, output: { denominator: 0, unknownShare: 1 } });
  });
});
