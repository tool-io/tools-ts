import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTenonShoulder, example } from "./tool.js";

describe("carpentry/tenon-shoulder", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateTenonShoulder(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, stockWidthMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain boundary", () => {
    expect(tool.execute({ ...example.input, stockWidthMm: 0 }).ok).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, tenonWidthMm: 0 })).toEqual({
      ok: true,
      output: { shoulderEachMm: 25 },
    });
  });
});
