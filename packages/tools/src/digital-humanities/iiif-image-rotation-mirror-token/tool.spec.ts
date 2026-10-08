import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("digital-humanities/iiif-image-rotation-mirror-token", () => {
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
    expect(tool.execute({ rotationDegrees: 0, mirror: false })).toEqual({
      ok: true,
      output: { rotationToken: "0" },
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
    "rejects nonfinite rotationDegrees",
    (value) =>
      expect(
        tool.execute({ ...example.input, rotationDegrees: value }).ok,
      ).toBe(false),
  );
  it.each([{ rotationDegrees: -1 }, { rotationDegrees: 361 }])(
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
  it.each([{ rotationDegrees: -1 }, { rotationDegrees: 361 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ rotationDegrees: 5e-7, mirror: true },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { rotationToken: "!0.0000005" },
    });
    expect(calculate(input)).toEqual({ rotationToken: "!0.0000005" });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ rotationDegrees: 360, mirror: false },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { rotationToken: "360" },
    });
    expect(calculate(input)).toEqual({ rotationToken: "360" });
  });
});
