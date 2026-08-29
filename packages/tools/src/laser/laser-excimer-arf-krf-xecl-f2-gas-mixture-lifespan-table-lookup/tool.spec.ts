import { describe, expect, it } from "vitest";
import {
  excimerLookup,
  excimerLookupExample as example,
  runExcimerLookup,
} from "./tool.js";

describe("excimer gas mixture table", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runExcimerLookup(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("orders photon energy inversely with wavelength", () => {
    const f2 = excimerLookup({ gas: "F2" });
    const xef = excimerLookup({ gas: "XeF" });
    expect(f2.photonEnergyEv).toBeGreaterThan(xef.photonEnergyEv);
    expect(f2.photonEnergyEv).toBeCloseTo(1239.842 / 157.6, 12);
    expect(xef.wavelengthNm).toBe(351.1);
  });
  it("rejects undocumented mixtures", () =>
    expect(runExcimerLookup({ gas: "XeBr" }).ok).toBe(false));
});
