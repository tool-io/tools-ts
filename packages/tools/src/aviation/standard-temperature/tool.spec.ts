import { describe, expect, it } from "vitest";
import {
  calculateStandardTemperature,
  standardTemperatureExample,
  runStandardTemperature,
} from "./tool.js";

describe("isa standard temperature calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runStandardTemperature(standardTemperatureExample.input)).toEqual({
      ok: true,
      output: standardTemperatureExample.output,
    });
  });

  it("returns fifteen degrees at sea level", () => {
    expect(calculateStandardTemperature({ altitudeFt: 0 })).toEqual({
      standardTemperatureC: 15,
    });
  });

  it("clamps to minus fifty-six point five degrees above the tropopause", () => {
    expect(calculateStandardTemperature({ altitudeFt: 40000 })).toEqual({
      standardTemperatureC: -56.5,
    });
  });

  it("rejects negative altitudes through execution", () => {
    expect(runStandardTemperature({ altitudeFt: -1 }).ok).toBe(false);
  });
});
