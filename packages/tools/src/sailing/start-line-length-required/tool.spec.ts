import { describe, expect, it } from "vitest";
import {
  runStartLineLengthRequired,
  startLineLengthRequiredExample,
} from "./tool.js";

describe("Start Line Length Rule", () => {
  it("publishes an executable example", () =>
    expect(
      runStartLineLengthRequired(startLineLengthRequiredExample.input),
    ).toEqual({
      ok: true,
      output: startLineLengthRequiredExample.output,
    }));

  it("applies the default scale factor of three", () =>
    expect(
      runStartLineLengthRequired({ boatCount: 8, averageBoatLengthMeters: 11 }),
    ).toEqual({
      ok: true,
      output: { recommendedLineLengthMeters: 264 },
    }));

  it("honours an explicit scale factor", () =>
    expect(
      runStartLineLengthRequired({
        boatCount: 10,
        averageBoatLengthMeters: 12,
        scaleFactor: 5,
      }),
    ).toEqual({
      ok: true,
      output: { recommendedLineLengthMeters: 600 },
    }));

  it("accepts the smallest permitted fleet of two boats", () =>
    expect(
      runStartLineLengthRequired({ boatCount: 2, averageBoatLengthMeters: 10 }),
    ).toEqual({
      ok: true,
      output: { recommendedLineLengthMeters: 60 },
    }));

  it("rejects fleets smaller than two boats", () => {
    for (const boatCount of [0, 1])
      expect(
        runStartLineLengthRequired({ boatCount, averageBoatLengthMeters: 12 })
          .ok,
      ).toBe(false);
  });

  it("rejects fractional boat counts", () => {
    expect(
      runStartLineLengthRequired({
        boatCount: 3.5,
        averageBoatLengthMeters: 12,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive average boat lengths", () => {
    for (const averageBoatLengthMeters of [0, -12]) {
      const result = runStartLineLengthRequired({
        averageBoatLengthMeters,
        boatCount: 10,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_length");
    }
  });

  it("rejects scale factors outside one to six", () => {
    for (const scaleFactor of [0.9, 6.1])
      expect(
        runStartLineLengthRequired({
          averageBoatLengthMeters: 12,
          boatCount: 10,
          scaleFactor,
        }).ok,
      ).toBe(false);
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runStartLineLengthRequired({
        averageBoatLengthMeters: Number.NaN,
        boatCount: 10,
      }).ok,
    ).toBe(false);
    expect(
      runStartLineLengthRequired({
        averageBoatLengthMeters: 12,
        boatCount: 10,
        extra: 1,
      }).ok,
    ).toBe(false);
  });
});
