import { describe, expect, it } from "vitest";
import { seedlingVigorIndexExample, runSeedlingVigorIndex } from "./tool.js";

describe("Seedling Vigor Index", () => {
  it("publishes an executable example", () =>
    expect(runSeedlingVigorIndex(seedlingVigorIndexExample.input)).toEqual({
      ok: true,
      output: seedlingVigorIndexExample.output,
    }));
  it("returns zero when nothing germinates", () =>
    expect(
      runSeedlingVigorIndex({
        germinationPercentNumber: 0,
        seedlingLengthCm: 10,
      }),
    ).toEqual({ ok: true, output: { seedlingVigorIndex: 0 } }));
  it("supports fractional lengths", () => {
    const result = runSeedlingVigorIndex({
      germinationPercentNumber: 100,
      seedlingLengthCm: 2.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.seedlingVigorIndex).toBe(250);
  });
  it("does not divide by one hundred unlike the seed vigor index", () => {
    const result = runSeedlingVigorIndex({
      germinationPercentNumber: 50,
      seedlingLengthCm: 12,
    });
    if (result.ok) expect(result.output.seedlingVigorIndex).toBe(600);
    else expect.fail("the calculation should succeed");
  });
  it("scales linearly with length", () => {
    const short = runSeedlingVigorIndex({
      germinationPercentNumber: 80,
      seedlingLengthCm: 5,
    });
    const tall = runSeedlingVigorIndex({
      germinationPercentNumber: 80,
      seedlingLengthCm: 10,
    });
    if (short.ok && tall.ok)
      expect(Number(tall.output.seedlingVigorIndex)).toBe(
        2 * Number(short.output.seedlingVigorIndex),
      );
    else expect.fail("both calculations should succeed");
  });
  it("rejects germination above one hundred percent", () =>
    expect(
      runSeedlingVigorIndex({
        germinationPercentNumber: 120,
        seedlingLengthCm: 10,
      }).ok,
    ).toBe(false));
  it("rejects zero seedling length", () =>
    expect(
      runSeedlingVigorIndex({
        germinationPercentNumber: 90,
        seedlingLengthCm: 0,
      }).ok,
    ).toBe(false));
});
