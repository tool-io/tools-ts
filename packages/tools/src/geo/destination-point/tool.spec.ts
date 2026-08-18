import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateDestinationPoint,
  destinationPointExample,
  destinationPointTool,
} from "./tool.js";

describe("Destination Point", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = destinationPointTool.execute(
      destinationPointExample.input,
    );
    expect(result).toEqual({
      ok: true,
      output: destinationPointExample.output,
    });
  });

  it("publishes a valid pure tool contract", () => {
    expect(destinationPointTool.id).toBe("geo/destination-point");
    expect(validateToolContract(destinationPointTool)).toEqual([]);
  });

  it("keeps latitude constant heading east along the equator and north at the pole path", () => {
    const north = calculateDestinationPoint({
      bearingDegrees: 0,
      distanceKm: 100,
      startLatitudeDeg: 0,
      startLongitudeDeg: 0,
    });
    expect(north.ok).toBe(true);
    if (north.ok) {
      expect(north.output.latitudeDeg).toBeCloseTo(0.9, 1);
      expect(north.output.longitudeDeg).toBe(0);
    }
  });

  it("wraps longitude into -180..180", () => {
    const wrapped = calculateDestinationPoint({
      bearingDegrees: 90,
      distanceKm: 1000,
      startLatitudeDeg: 0,
      startLongitudeDeg: 179.5,
    });
    expect(wrapped.ok).toBe(true);
    if (wrapped.ok) {
      expect(wrapped.output.longitudeDeg).toBeLessThanOrEqual(180);
      // 188.49 degrees east wraps across the antimeridian.
      expect(wrapped.output.longitudeDeg).toBeCloseTo(-171.51, 1);
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateDestinationPoint(null).ok).toBe(false);
    expect(calculateDestinationPoint({})).toMatchObject({
      error: { issues: { length: 4 } },
    });
    expect(
      calculateDestinationPoint({
        bearingDegrees: 400,
        distanceKm: 10,
        startLatitudeDeg: 0,
        startLongitudeDeg: 0,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateDestinationPoint({
        bearingDegrees: 0,
        distanceKm: 0,
        startLatitudeDeg: 95,
        startLongitudeDeg: 0,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
