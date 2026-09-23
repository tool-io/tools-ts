import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("calculus/parametric-curve-local-turning-sign", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("matches its canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independently specified boundary or alternate case", () => {
    expect(tool.execute({ dx: 0, dy: 1, ddx: 2, ddy: 0 })).toEqual({
      ok: true,
      output: { cross: -2, sign: -1 },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    { ...example.input, dx: null },
  ])("rejects malformed input %j", (input) => {
    const result = tool.execute(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite dx", (value) =>
    expect(tool.execute({ ...example.input, dx: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite dy", (value) =>
    expect(tool.execute({ ...example.input, dy: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite ddx", (value) =>
    expect(tool.execute({ ...example.input, ddx: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite ddy", (value) =>
    expect(tool.execute({ ...example.input, ddy: value }).ok).toBe(false),
  );
});
