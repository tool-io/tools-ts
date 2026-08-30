import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTotalSystemLatency, example } from "./tool.js";

describe("vr/total-system-latency", () => {
  it("matches its worked example", () => {
    expect(calculateTotalSystemLatency(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, trackingMilliseconds: Number.NaN }).ok,
    ).toBe(false);
  });
});
