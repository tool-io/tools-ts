import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("information/conditional-mutual-information-one-cell", () => {
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
    expect(tool.execute({ joint: 0.5, xz: 0.5, yz: 0.5, z: 1 })).toEqual({
      ok: true,
      output: { contribution: 0.5 },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    { ...example.input, joint: null },
  ])("rejects malformed input %j", (input) => {
    const result = tool.execute(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite joint", (value) =>
    expect(tool.execute({ ...example.input, joint: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite xz", (value) =>
    expect(tool.execute({ ...example.input, xz: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite yz", (value) =>
    expect(tool.execute({ ...example.input, yz: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite z", (value) =>
    expect(tool.execute({ ...example.input, z: value }).ok).toBe(false),
  );
});

it("rejects explicit invalid domain and token boundary cases", () => {
  for (const change of [{ joint: 0.9, xz: 0.5 }]) {
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
