import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateCrownMoldingLength, example } from "./tool.js";

describe("carpentry/crown-molding-length", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateCrownMoldingLength(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, wallRunsM: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects an invalid domain boundary", () => {
    expect(tool.execute({ ...example.input, wallRunsM: [-1] }).ok).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, wastePercent: 0 })).toEqual({
      ok: true,
      output: { materialLengthM: 7 },
    });
  });
});
