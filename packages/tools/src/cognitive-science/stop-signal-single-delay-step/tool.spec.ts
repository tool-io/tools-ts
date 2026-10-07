import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("cognitive-science/stop-signal-single-delay-step", () => {
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
        currentDelayMilliseconds: 20,
        stepMilliseconds: 50,
        inhibitionSuccessful: false,
        minimumDelayMilliseconds: 0,
        maximumDelayMilliseconds: 500,
      }),
    ).toEqual({
      ok: true,
      output: { nextDelayMilliseconds: 0, boundaryClipped: true },
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
    "rejects nonfinite currentDelayMilliseconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, currentDelayMilliseconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite stepMilliseconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, stepMilliseconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite minimumDelayMilliseconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, minimumDelayMilliseconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite maximumDelayMilliseconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, maximumDelayMilliseconds: value }).ok,
      ).toBe(false),
  );
  it.each([{ stepMilliseconds: -1 }, { minimumDelayMilliseconds: -1 }])(
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
  it.each([{ stepMilliseconds: -1 }, { minimumDelayMilliseconds: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});
