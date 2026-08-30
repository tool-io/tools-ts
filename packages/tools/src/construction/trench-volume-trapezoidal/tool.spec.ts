import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTrenchVolumeTrapezoidal, example } from "./tool.js";

describe("construction/trench-volume-trapezoidal", () => {
  it("matches the canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateTrenchVolumeTrapezoidal(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, topWidthM: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects an invalid domain boundary", () => {
    expect(tool.execute({ ...example.input, topWidthM: 0 }).ok).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, bottomWidthM: 0 })).toEqual({
      ok: true,
      output: { volumeM3: 10 },
    });
  });
});
