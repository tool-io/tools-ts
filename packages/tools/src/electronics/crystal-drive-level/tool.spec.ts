import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateCrystalDriveLevel, example } from "./tool.js";

describe("electronics/crystal-drive-level", () => {
  it("matches the canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateCrystalDriveLevel(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, motionalCurrentRmsA: Number.NaN }).ok,
    ).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, motionalCurrentRmsA: 0 })).toEqual({
      ok: true,
      output: { drivePowerW: 0 },
    });
  });
});
