import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("validate/numeric-open-boundary-neighbor", () => {
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
    expect(tool.execute({ boundary: 1, direction: "below" })).toEqual({
      ok: true,
      output: { neighbor: 0.9999999999999999, representable: true },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite boundary", (value) =>
    expect(tool.execute({ ...example.input, boundary: value }).ok).toBe(false),
  );
  it.each([{ direction: "__invalid_enum__" }])(
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
  it.each([{ direction: "__invalid_enum__" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("zero steps to the minimum positive subnormal", () => {
    const output = calculate({ boundary: 0, direction: "above" });
    expect(output).toMatchObject({ neighbor: 5e-324, representable: true });
    expect(tool.execute({ boundary: 0, direction: "above" })).toEqual({
      ok: true,
      output,
    });
  });
  it("zero steps down to the negative minimum subnormal", () => {
    const output = calculate({ boundary: 0, direction: "below" });
    expect(output).toMatchObject({ neighbor: -5e-324, representable: true });
    expect(tool.execute({ boundary: 0, direction: "below" })).toEqual({
      ok: true,
      output,
    });
  });
  it("negative-one steps upward in numeric order", () => {
    const output = calculate({ boundary: -1, direction: "above" });
    expect(output).toMatchObject({
      neighbor: -0.9999999999999999,
      representable: true,
    });
    expect(tool.execute({ boundary: -1, direction: "above" })).toEqual({
      ok: true,
      output,
    });
  });
  it("reports no finite value beyond the maximum", () => {
    const output = calculate({
      boundary: 1.7976931348623157e308,
      direction: "above",
    });
    expect(output).toMatchObject({
      neighbor: 1.7976931348623157e308,
      representable: false,
    });
    expect(
      tool.execute({ boundary: 1.7976931348623157e308, direction: "above" }),
    ).toEqual({ ok: true, output });
  });
});
