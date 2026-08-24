import { describe, expect, it } from "vitest";
import {
  destinationPointExample,
  calculateDestinationPoint,
  runDestinationPoint,
} from "./tool.js";

describe("geography/destination-point", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDestinationPoint(destinationPointExample.input)).toEqual({
      ok: true,
      output: destinationPointExample.output,
    });
  });
  it("rejects invalid input (case)", () => {
    expect(
      runDestinationPoint({
        latitudeDeg: 95,
        longitudeDeg: 0,
        bearingDeg: 0,
        distanceM: 1000,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runDestinationPoint({
        latitudeDeg: 0,
        longitudeDeg: 0,
        bearingDeg: 0,
        distanceM: -1,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runDestinationPoint({
        latitudeDeg: 0,
        longitudeDeg: 0,
        bearingDeg: 361,
        distanceM: 1000,
      }).ok,
    ).toBe(false);
  });
  it("returns the origin for zero distance", () => {
    const result = runDestinationPoint({
      bearingDeg: 217,
      distanceM: 0,
      latitudeDeg: -13.1631,
      longitudeDeg: -72.545,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.destinationLatitudeDeg).toBeCloseTo(-13.1631, 12);
      expect(result.output.destinationLongitudeDeg).toBeCloseTo(-72.545, 12);
    }
  });

  it("travels due north along a meridian", () => {
    const result = runDestinationPoint({
      bearingDeg: 0,
      distanceM: 111195.08023353292,
      latitudeDeg: 0,
      longitudeDeg: 30,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.destinationLongitudeDeg).toBeCloseTo(30, 9);
      expect(result.output.destinationLatitudeDeg).toBeGreaterThan(0.99);
      expect(result.output.destinationLatitudeDeg).toBeLessThan(1.01);
    }
  });
});
