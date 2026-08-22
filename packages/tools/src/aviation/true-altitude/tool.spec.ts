import { describe, expect, it } from "vitest";
import { runTrueAltitude } from "./tool.js";

describe("true altitude calculator", () => {
  it("adds four feet per degree of deviation per thousand feet", () => {
    const warm = runTrueAltitude({
      indicatedAltitudeFt: 5000,
      isaTemperatureC: 15,
      oatC: 25,
    });
    expect(warm).toEqual({ ok: true, output: { trueAltitudeFt: 5200 } });
    const cold = runTrueAltitude({
      indicatedAltitudeFt: 5000,
      isaTemperatureC: 15,
      oatC: 5,
    });
    expect(cold).toEqual({ ok: true, output: { trueAltitudeFt: 4800 } });
  });

  it("is unchanged at ISA temperature", () => {
    expect(
      runTrueAltitude({
        indicatedAltitudeFt: 9000,
        isaTemperatureC: -2.8896,
        oatC: -2.8896,
      }).ok,
    ).toBe(true);
  });
});
