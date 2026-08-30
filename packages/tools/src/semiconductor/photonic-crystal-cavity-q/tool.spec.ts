import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePhotonicCrystalCavityQ, example } from "./tool.js";

describe("semiconductor/photonic-crystal-cavity-q", () => {
  it("matches its worked example", () => {
    expect(calculatePhotonicCrystalCavityQ(example.input)).toEqual(
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
    expect(
      tool.execute({ ...example.input, resonanceHertz: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative resonanceHertz", () => {
    expect(tool.execute({ ...example.input, resonanceHertz: -1 }).ok).toBe(
      false,
    );
  });
});
