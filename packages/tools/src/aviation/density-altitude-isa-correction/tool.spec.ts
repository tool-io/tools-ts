import { describe, expect, it } from "vitest";
import {
  calculateDensityAltitudeIsaCorrection,
  runDensityAltitudeIsaCorrection,
  densityAltitudeIsaCorrectionExample,
} from "./tool.js";

describe("density altitude isa correction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDensityAltitudeIsaCorrection(
        densityAltitudeIsaCorrectionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: densityAltitudeIsaCorrectionExample.output,
    });
  });

  it("returns pressure altitude unchanged on an ISA day", () => {
    expect(
      runDensityAltitudeIsaCorrection({ oatC: 15, pressureAltitudeFt: 0 }),
    ).toEqual({
      ok: true,
      output: { densityAltitudeFt: 0 },
    });
    expect(
      runDensityAltitudeIsaCorrection({
        oatC: 5.094000000000001,
        pressureAltitudeFt: 5000,
      }),
    ).toEqual({
      ok: true,
      output: { densityAltitudeFt: 5000 },
    });
  });

  it("adds 118.8 feet per degree Celsius above ISA", () => {
    expect(
      calculateDensityAltitudeIsaCorrection({
        oatC: 30,
        pressureAltitudeFt: 5000,
      }),
    ).toEqual({
      densityAltitudeFt: 5000 + 118.8 * (30 - (15 - 0.0019812 * 5000)),
    });
  });

  it("subtracts correction below ISA on a cold day", () => {
    expect(
      calculateDensityAltitudeIsaCorrection({
        oatC: -10,
        pressureAltitudeFt: 5000,
      }),
    ).toEqual({
      densityAltitudeFt: 5000 + 118.8 * (-10 - (15 - 0.0019812 * 5000)),
    });
  });

  it("keeps raw results without rounding", () => {
    expect(
      calculateDensityAltitudeIsaCorrection({
        oatC: 15.5,
        pressureAltitudeFt: 12345,
      }),
    ).toEqual({
      densityAltitudeFt: 12345 + 118.8 * (15.5 - (15 - 0.0019812 * 12345)),
    });
  });

  it("accepts both pressure altitude bounds through execution", () => {
    expect(
      runDensityAltitudeIsaCorrection({ oatC: 15, pressureAltitudeFt: -1000 })
        .ok,
    ).toBe(true);
    expect(
      runDensityAltitudeIsaCorrection({ oatC: 15, pressureAltitudeFt: 20000 })
        .ok,
    ).toBe(true);
  });

  it("rejects out-of-range pressure altitudes through execution", () => {
    for (const bad of [-1000.5, 20000.5])
      expect(
        runDensityAltitudeIsaCorrection({ oatC: 15, pressureAltitudeFt: bad })
          .ok,
      ).toBe(false);
  });

  it("rejects out-of-range temperatures through execution", () => {
    for (const bad of [-80.5, 60.5])
      expect(
        runDensityAltitudeIsaCorrection({ oatC: bad, pressureAltitudeFt: 0 })
          .ok,
      ).toBe(false);
  });

  it("reports stable error codes for invalid inputs", () => {
    const result = runDensityAltitudeIsaCorrection({
      oatC: 61,
      pressureAltitudeFt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("matches a high hot-field case", () => {
    expect(
      runDensityAltitudeIsaCorrection({
        oatC: 45,
        pressureAltitudeFt: 6000,
      }),
    ).toEqual({
      ok: true,
      output: {
        densityAltitudeFt: 6000 + 118.8 * (45 - (15 - 0.0019812 * 6000)),
      },
    });
  });
});
