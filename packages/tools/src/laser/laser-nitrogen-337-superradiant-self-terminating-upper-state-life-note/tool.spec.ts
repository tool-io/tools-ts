import { describe, expect, it } from "vitest";
import {
  nitrogenLifeExample as example,
  nitrogenLifeNote,
  runNitrogenLife,
} from "./tool.js";

describe("N2 self-termination note", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runNitrogenLife(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("flags slow pumps against the 40 ns upper lifetime", () => {
    const out = nitrogenLifeNote({ pumpPulseDurationNs: 200 });
    expect(out.upperLifetimeNs).toBe(40);
    expect(out.laserWavelengthNm).toBe(337.1);
    expect(out.pumpShorterThanUpperLifetime).toBe(false);
  });
  it("rejects non-positive pump durations", () =>
    expect(runNitrogenLife({ pumpPulseDurationNs: 0 }).ok).toBe(false));
});
