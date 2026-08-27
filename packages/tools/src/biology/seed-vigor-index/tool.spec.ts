import { describe, expect, it } from "vitest";
import { seedVigorIndexExample, runSeedVigorIndex } from "./tool.js";

describe("Seed Vigor Index", () => {
  it("publishes an executable example", () =>
    expect(runSeedVigorIndex(seedVigorIndexExample.input)).toEqual({
      ok: true,
      output: seedVigorIndexExample.output,
    }));
  it("returns zero when nothing germinates", () =>
    expect(
      runSeedVigorIndex({ germinationPercentNumber: 0, seedlingLengthCm: 10 }),
    ).toEqual({ ok: true, output: { vigorIndex: 0 } }));
  it("supports fractional lengths", () => {
    const result = runSeedVigorIndex({
      germinationPercentNumber: 100,
      seedlingLengthCm: 2.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.vigorIndex).toBe(2.5);
  });
  it("divides by one hundred unlike the seedling vigor index", () => {
    const result = runSeedVigorIndex({
      germinationPercentNumber: 50,
      seedlingLengthCm: 12,
    });
    if (result.ok) expect(result.output.vigorIndex).toBe(6);
    else expect.fail("the calculation should succeed");
  });
  it("rejects germination above one hundred percent", () =>
    expect(
      runSeedVigorIndex({ germinationPercentNumber: 101, seedlingLengthCm: 10 })
        .ok,
    ).toBe(false));
  it("rejects negative germination", () =>
    expect(
      runSeedVigorIndex({ germinationPercentNumber: -1, seedlingLengthCm: 10 })
        .ok,
    ).toBe(false));
  it("rejects zero seedling length", () =>
    expect(
      runSeedVigorIndex({ germinationPercentNumber: 90, seedlingLengthCm: 0 })
        .ok,
    ).toBe(false));
  it("rejects negative seedling length", () =>
    expect(
      runSeedVigorIndex({ germinationPercentNumber: 90, seedlingLengthCm: -3 })
        .ok,
    ).toBe(false));
});
