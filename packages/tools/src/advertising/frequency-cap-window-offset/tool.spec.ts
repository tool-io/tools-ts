import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("advertising/frequency-cap-window-offset", () => {
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
      tool.execute({ eventTime: 95, windowOrigin: 100, windowLength: 10 }),
    ).toEqual({ ok: true, output: { windowIndex: -1, offset: 5 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite eventTime", (value) =>
    expect(tool.execute({ ...example.input, eventTime: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite windowOrigin",
    (value) =>
      expect(tool.execute({ ...example.input, windowOrigin: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite windowLength",
    (value) =>
      expect(tool.execute({ ...example.input, windowLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ windowLength: 0 }])(
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
  it.each([{ windowLength: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 71 independent regressions", () => {
  it("retains exact positive carry across two safe integer endpoints", () => {
    expect(
      calculate({
        eventTime: 9007199254740991,
        windowOrigin: -9007199254740991,
        windowLength: 7,
      }),
    ).toEqual({ windowIndex: 2573485501354568, offset: 6 });
    expect(
      tool.execute({
        eventTime: 9007199254740991,
        windowOrigin: -9007199254740991,
        windowLength: 7,
      }),
    ).toEqual({
      ok: true,
      output: { windowIndex: 2573485501354568, offset: 6 },
    });
  });
  it("retains exact negative carry across two safe integer endpoints", () => {
    expect(
      calculate({
        eventTime: -9007199254740991,
        windowOrigin: 9007199254740991,
        windowLength: 7,
      }),
    ).toEqual({ windowIndex: -2573485501354569, offset: 1 });
    expect(
      tool.execute({
        eventTime: -9007199254740991,
        windowOrigin: 9007199254740991,
        windowLength: 7,
      }),
    ).toEqual({
      ok: true,
      output: { windowIndex: -2573485501354569, offset: 1 },
    });
  });
});
