import { describe, expect, it } from "vitest";
import { runCriticalPressureLookup } from "./tool.js";
describe("Critical Pressure Lookup", () => {
  it("looks up water as 22064 kPa", () => {
    expect(runCriticalPressureLookup({ substance: "water" })).toEqual({
      ok: true,
      output: { criticalPressureKPa: 22064 },
    });
  });
  it("rejects invalid input", () =>
    expect(runCriticalPressureLookup(null).ok).toBe(false));
  it("uses the correct methane critical pressure", () =>
    expect(runCriticalPressureLookup({ substance: "methane" })).toEqual({
      ok: true,
      output: { criticalPressureKPa: 4599.2 },
    }));
  it("rejects an unknown substance", () =>
    expect(runCriticalPressureLookup({ substance: "unobtainium" }).ok).toBe(
      false,
    ));
});
