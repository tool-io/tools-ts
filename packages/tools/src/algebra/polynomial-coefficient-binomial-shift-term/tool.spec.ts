import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("algebra/polynomial-coefficient-binomial-shift-term", () => {
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
    expect(
      tool.execute({
        coefficient: 5,
        sourcePower: 2,
        targetPower: 2,
        shift: 0,
      }),
    ).toEqual({ ok: true, output: { contribution: 5 } });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    { ...example.input, coefficient: null },
  ])("rejects malformed input %j", (input) => {
    const result = tool.execute(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coefficient",
    (value) =>
      expect(tool.execute({ ...example.input, coefficient: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sourcePower",
    (value) =>
      expect(tool.execute({ ...example.input, sourcePower: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetPower",
    (value) =>
      expect(tool.execute({ ...example.input, targetPower: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite shift", (value) =>
    expect(tool.execute({ ...example.input, shift: value }).ok).toBe(false),
  );
});
