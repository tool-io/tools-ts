import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("rheumatology/joint-motion-unit-factor", () => {
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
        angle: 3.141592653589793,
        radiansPerSourceUnit: 1,
        radiansPerTargetUnit: 0.017453292519943295,
      }),
    ).toEqual({ ok: true, output: { convertedAngle: 180 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite angle", (value) =>
    expect(tool.execute({ ...example.input, angle: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite radiansPerSourceUnit",
    (value) =>
      expect(
        tool.execute({ ...example.input, radiansPerSourceUnit: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite radiansPerTargetUnit",
    (value) =>
      expect(
        tool.execute({ ...example.input, radiansPerTargetUnit: value }).ok,
      ).toBe(false),
  );
  it.each([{ radiansPerSourceUnit: 0 }, { radiansPerTargetUnit: 0 }])(
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
  it.each([{ radiansPerSourceUnit: 0 }, { radiansPerTargetUnit: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});
