import { describe, expect, it } from "vitest";
import {
  calculateQnhFromQfeFieldElevation,
  runQnhFromQfeFieldElevation,
  qnhFromQfeFieldElevationExample,
} from "./tool.js";

describe("qnh from qfe field elevation calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runQnhFromQfeFieldElevation(qnhFromQfeFieldElevationExample.input),
    ).toEqual({
      ok: true,
      output: qnhFromQfeFieldElevationExample.output,
    });
  });

  it("adds elevation pressure at 8.23 meters per hectopascal", () => {
    expect(
      calculateQnhFromQfeFieldElevation({
        elevationMeters: -50,
        qfeHpa: 1013.25,
      }),
    ).toEqual({ qnhHpa: 1013.25 + -50 / 8.23 });
    expect(
      calculateQnhFromQfeFieldElevation({
        elevationMeters: 9000,
        qfeHpa: 900,
      }),
    ).toEqual({ qnhHpa: 900 + 9000 / 8.23 });
  });

  it("returns QFE unchanged at zero elevation", () => {
    expect(
      calculateQnhFromQfeFieldElevation({
        elevationMeters: 0,
        qfeHpa: 1013.25,
      }),
    ).toEqual({ qnhHpa: 1013.25 });
  });

  it("handles below-sea-level fields", () => {
    expect(
      runQnhFromQfeFieldElevation({ elevationMeters: -500, qfeHpa: 950 }),
    ).toEqual({
      ok: true,
      output: { qnhHpa: 950 + -500 / 8.23 },
    });
  });

  it("accepts both input bounds through execution", () => {
    expect(
      runQnhFromQfeFieldElevation({ elevationMeters: 0, qfeHpa: 300 }).ok,
    ).toBe(true);
    expect(
      runQnhFromQfeFieldElevation({ elevationMeters: 0, qfeHpa: 1100 }).ok,
    ).toBe(true);
    expect(
      runQnhFromQfeFieldElevation({
        elevationMeters: -500,
        qfeHpa: 1000,
      }).ok,
    ).toBe(true);
    expect(
      runQnhFromQfeFieldElevation({ elevationMeters: 9000, qfeHpa: 1000 }).ok,
    ).toBe(true);
  });

  it("rejects QFE outside 300 to 1100 hPa through execution", () => {
    for (const bad of [299.9, 1100.1])
      expect(
        runQnhFromQfeFieldElevation({ elevationMeters: 0, qfeHpa: bad }).ok,
      ).toBe(false);
  });

  it("rejects elevations outside -500 to 9000 m through execution", () => {
    for (const bad of [-500.5, 9000.5])
      expect(
        runQnhFromQfeFieldElevation({ elevationMeters: bad, qfeHpa: 1000 }).ok,
      ).toBe(false);
  });

  it("reports stable error codes for out-of-range inputs", () => {
    const result = runQnhFromQfeFieldElevation({
      elevationMeters: 0,
      qfeHpa: 299.9,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("keeps raw results without rounding", () => {
    expect(
      calculateQnhFromQfeFieldElevation({
        elevationMeters: 1,
        qfeHpa: 1000,
      }),
    ).toEqual({ qnhHpa: 1000 + 1 / 8.23 });
  });
});
