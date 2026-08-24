import { describe, expect, it } from "vitest";
import {
  photodiodeDarkCurrentExample,
  runPhotodiodeDarkCurrent,
} from "./tool.js";

describe("dark current calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPhotodiodeDarkCurrent(photodiodeDarkCurrentExample.input),
    ).toEqual({ ok: true, output: photodiodeDarkCurrentExample.output });
  });

  it("returns zero dark current for a perfect diode", () => {
    const result = runPhotodiodeDarkCurrent({
      activeAreaCm2: 0.5,
      darkCurrentDensityNAPerCm2: 0,
    });
    expect(result).toEqual({ ok: true, output: { darkCurrentNA: 0 } });
  });

  it("computes unity-area density directly", () => {
    const result = runPhotodiodeDarkCurrent({
      activeAreaCm2: 1,
      darkCurrentDensityNAPerCm2: 25,
    });
    expect(result).toEqual({ ok: true, output: { darkCurrentNA: 25 } });
  });

  it("scales linearly with active area", () => {
    const one = runPhotodiodeDarkCurrent({
      activeAreaCm2: 0.2,
      darkCurrentDensityNAPerCm2: 12,
    });
    const two = runPhotodiodeDarkCurrent({
      activeAreaCm2: 0.4,
      darkCurrentDensityNAPerCm2: 12,
    });
    if (!one.ok || !two.ok) throw new Error("expected success");
    expect(two.output.darkCurrentNA as number).toBe(
      2 * (one.output.darkCurrentNA as number),
    );
  });

  it("handles fractional results exactly", () => {
    const result = runPhotodiodeDarkCurrent({
      activeAreaCm2: 0.3,
      darkCurrentDensityNAPerCm2: 5,
    });
    expect(result).toEqual({ ok: true, output: { darkCurrentNA: 1.5 } });
  });

  it("rejects non-positive area", () => {
    for (const area of [0, -2])
      expect(
        runPhotodiodeDarkCurrent({
          activeAreaCm2: area,
          darkCurrentDensityNAPerCm2: 10,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects negative density through the schema bound", () => {
    expect(
      runPhotodiodeDarkCurrent({
        activeAreaCm2: 0.01,
        darkCurrentDensityNAPerCm2: -10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects missing and unknown fields", () => {
    expect(runPhotodiodeDarkCurrent({ activeAreaCm2: 0.01 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runPhotodiodeDarkCurrent({
        activeAreaCm2: 0.01,
        darkCurrentDensityNAPerCm2: 10,
        temperatureK: 300,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "temperatureK" }] },
      ok: false,
    });
  });
});
