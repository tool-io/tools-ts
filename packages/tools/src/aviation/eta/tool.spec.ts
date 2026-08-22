import { describe, expect, it } from "vitest";
import { etaExample, runEta } from "./tool.js";

describe("eta calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEta(etaExample.input)).toEqual({
      ok: true,
      output: { dayOffset: 0, etaTime: "17:15" },
    });
  });

  it("wraps past midnight with a day offset", () => {
    expect(runEta({ departureTime: "23:30", flightHours: 1.5 })).toEqual({
      ok: true,
      output: { dayOffset: 1, etaTime: "01:00" },
    });
  });

  it("rejects malformed departure times through execution", () => {
    for (const bad of ["24:00", "noon", "7:5"])
      expect(runEta({ departureTime: bad, flightHours: 1 }).ok).toBe(false);
  });
});
