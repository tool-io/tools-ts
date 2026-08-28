import { describe, expect, it } from "vitest";
import { runIonizationEnergyLookup } from "./tool.js";

describe("Ionization Energy Lookup", () => {
  it("returns 1312 for hydrogen", () => {
    const r = runIonizationEnergyLookup({ element: "H" });
    if (!r.ok) throw new Error("fail");
    expect(r.output.ionizationEnergyKJPerMol).toBe(1312);
  });
  it("rejects invalid input", () =>
    expect(runIonizationEnergyLookup(null).ok).toBe(false));
});
