import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("calculus/implicit-levelset-gradient-normalizer", () => {
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
    expect(tool.execute({ gradient: [0, 2] })).toEqual({
      ok: true,
      output: { normal: [0, 1], magnitude: 2 },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    { ...example.input, gradient: null },
  ])("rejects malformed input %j", (input) => {
    const result = tool.execute(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});

it("rejects explicit invalid domain and token boundary cases", () => {
  for (const change of [{ gradient: [0, 0] }]) {
    const result = tool.execute({ ...example.input, ...change });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues[0].code).toMatch(
        /invalid_|result_out_of_range/,
      );
    }
  }
});
