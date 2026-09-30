import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("microcontroller/spi-interword-idle-clock-count", () => {
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
      tool.execute({ idleSeconds: 0.0025, clockHz: 1000, roundUp: false }),
    ).toEqual({ ok: true, output: { clocks: 2, actualSeconds: 0.002 } });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    { ...example.input, idleSeconds: null },
  ])("rejects malformed input %j", (input) => {
    const result = tool.execute(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite idleSeconds",
    (value) =>
      expect(tool.execute({ ...example.input, idleSeconds: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite clockHz", (value) =>
    expect(tool.execute({ ...example.input, clockHz: value }).ok).toBe(false),
  );
});
