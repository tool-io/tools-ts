import { describe, expect, it } from "vitest";
import { runCriticalTemperatureLookup } from "./tool.js";
describe("Critical Temperature Lookup", () => {
  it("looks up water as 647.096 K", () => {
    expect(runCriticalTemperatureLookup({ substance: "water" })).toEqual({
      ok: true,
      output: { criticalTempK: 647.096 },
    });
  });
  it("rejects invalid input", () =>
    expect(runCriticalTemperatureLookup(null).ok).toBe(false));
  it("rejects an unknown substance", () =>
    expect(runCriticalTemperatureLookup({ substance: "unobtainium" }).ok).toBe(
      false,
    ));
});
