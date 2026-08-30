import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateChainDriveSpeedRatio, example } from "./tool.js";

describe("engineering/chain-drive-speed-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateChainDriveSpeedRatio(example.input)).toEqual(
      example.output,
    );
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
    expect(tool.execute({ ...example.input, driverTeeth: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("requires positive integer counts", () => {
    expect(tool.execute({ ...example.input, driverTeeth: 0 }).ok).toBe(false);
    expect(tool.execute({ ...example.input, drivenTeeth: 0 }).ok).toBe(false);
  });
});
