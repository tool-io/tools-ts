import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSleepAverageCurrent, example } from "./tool.js";

describe("microcontroller/sleep-average-current", () => {
  it("matches its worked example", () => {
    expect(calculateSleepAverageCurrent(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, activeMilliamperes: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative activeMilliamperes", () => {
    expect(tool.execute({ ...example.input, activeMilliamperes: -1 }).ok).toBe(
      false,
    );
  });
});
