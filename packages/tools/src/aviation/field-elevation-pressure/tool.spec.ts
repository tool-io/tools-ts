import { describe, expect, it } from "vitest";
import {
  fieldElevationPressureExample,
  runFieldElevationPressure,
} from "./tool.js";

describe("field elevation pressure calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFieldElevationPressure(fieldElevationPressureExample.input),
    ).toEqual({
      ok: true,
      output: fieldElevationPressureExample.output,
    });
  });

  it("returns standard sea-level pressure at zero elevation", () => {
    expect(runFieldElevationPressure({ elevationFt: 0 })).toEqual({
      ok: true,
      output: { pressureHpa: 1013.25 },
    });
  });

  it("rejects negative elevations through execution", () => {
    expect(runFieldElevationPressure({ elevationFt: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_altitude" }] },
      ok: false,
    });
  });
});
