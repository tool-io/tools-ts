import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateWormGearRatio, example } from "./tool.js";

describe("engineering/worm-gear-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateWormGearRatio(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, wheelTeeth: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("requires positive integer counts", () => {
    expect(tool.execute({ ...example.input, wheelTeeth: 0 }).ok).toBe(false);
    expect(tool.execute({ ...example.input, wormStarts: 0 }).ok).toBe(false);
  });
});
