import { describe, expect, it } from "vitest";
import { runSeedlingLengthVigor, seedlingLengthVigorExample } from "./tool.js";

describe("Seedling Length Vigor", () => {
  it("publishes an executable example", () =>
    expect(runSeedlingLengthVigor(seedlingLengthVigorExample.input)).toEqual({
      ok: true,
      output: seedlingLengthVigorExample.output,
    }));
  it("returns the shoot length when the root is absent", () =>
    expect(
      runSeedlingLengthVigor({ rootLengthCm: 0, shootLengthCm: 9 }),
    ).toEqual({ ok: true, output: { seedlingTotalLengthCm: 9 } }));
  it("returns the root length when the shoot is absent", () =>
    expect(
      runSeedlingLengthVigor({ rootLengthCm: 4.5, shootLengthCm: 0 }),
    ).toEqual({ ok: true, output: { seedlingTotalLengthCm: 4.5 } }));
  it("supports fractional lengths", () =>
    expect(
      runSeedlingLengthVigor({ rootLengthCm: 1.25, shootLengthCm: 2.5 }),
    ).toEqual({ ok: true, output: { seedlingTotalLengthCm: 3.75 } }));
  it("rejects negative shoot length", () =>
    expect(
      runSeedlingLengthVigor({ rootLengthCm: 3, shootLengthCm: -1 }).ok,
    ).toBe(false));
  it("rejects negative root length", () =>
    expect(
      runSeedlingLengthVigor({ rootLengthCm: -1, shootLengthCm: 3 }).ok,
    ).toBe(false));
});
