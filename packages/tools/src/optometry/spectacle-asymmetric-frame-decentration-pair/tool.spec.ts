import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("optometry/spectacle-asymmetric-frame-decentration-pair", () => {
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
        frameCenterDistance: 64,
        rightMonocularDistance: 32,
        leftMonocularDistance: 32,
        effectiveDiameter: 48,
      }),
    ).toEqual({
      ok: true,
      output: {
        rightDecentration: 0,
        leftDecentration: 0,
        nominalBlankDiameter: 48,
      },
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
    "rejects nonfinite frameCenterDistance",
    (value) =>
      expect(
        tool.execute({ ...example.input, frameCenterDistance: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rightMonocularDistance",
    (value) =>
      expect(
        tool.execute({ ...example.input, rightMonocularDistance: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite leftMonocularDistance",
    (value) =>
      expect(
        tool.execute({ ...example.input, leftMonocularDistance: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite effectiveDiameter",
    (value) =>
      expect(
        tool.execute({ ...example.input, effectiveDiameter: value }).ok,
      ).toBe(false),
  );
  it.each([
    { frameCenterDistance: -1 },
    { rightMonocularDistance: -1 },
    { leftMonocularDistance: -1 },
    { effectiveDiameter: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { frameCenterDistance: -1 },
    { rightMonocularDistance: -1 },
    { leftMonocularDistance: -1 },
    { effectiveDiameter: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
