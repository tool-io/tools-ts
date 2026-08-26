import { describe, expect, it } from "vitest";
import {
  calculateWaypointEtaCurrentCorrected,
  waypointEtaCurrentCorrectedExample,
  runWaypointEtaCurrentCorrected,
} from "./tool.js";

const trackSpeed = (
  boatSpeedKt: number,
  currentKt: number,
  setDeg: number,
  courseDeg: number,
): number => {
  const angle = (setDeg - courseDeg) * (Math.PI / 180);
  const along = currentKt * Math.cos(angle);
  const cross = currentKt * Math.sin(angle);
  return Math.sqrt(boatSpeedKt ** 2 - cross ** 2) + along;
};

describe("Corrected Waypoint ETA", () => {
  it("publishes an executable example", () =>
    expect(
      runWaypointEtaCurrentCorrected(waypointEtaCurrentCorrectedExample.input),
    ).toEqual({
      ok: true,
      output: waypointEtaCurrentCorrectedExample.output,
    }));

  it.each([
    [3, 1, 90, 90, 8],
    [5, 0, 45, 45, 10],
    [5, 2, 270, 90, 5],
    [4, 2, 60, 60, 6],
    [6, 3, 30, 210, 9],
  ])(
    "computes speed while holding the waypoint track",
    (boatSpeedKt, currentKt, currentSetDeg, courseDeg, distanceNm) => {
      const expectedSog = trackSpeed(
        boatSpeedKt,
        currentKt,
        currentSetDeg,
        courseDeg,
      );
      expect(
        calculateWaypointEtaCurrentCorrected({
          boatSpeedKt,
          courseDeg,
          currentKt,
          currentSetDeg,
          distanceNm,
        }),
      ).toEqual({
        etaHours: distanceNm / expectedSog,
        speedOverGroundKt: expectedSog,
      });
    },
  );

  it("adds a following current and subtracts a foul one", () => {
    expect(
      runWaypointEtaCurrentCorrected({
        boatSpeedKt: 5,
        courseDeg: 0,
        currentKt: 2,
        currentSetDeg: 0,
        distanceNm: 14,
      }),
    ).toEqual({ ok: true, output: { etaHours: 2, speedOverGroundKt: 7 } });
    expect(
      calculateWaypointEtaCurrentCorrected({
        boatSpeedKt: 5,
        courseDeg: 0,
        currentKt: 2,
        currentSetDeg: 180,
        distanceNm: 15,
      }),
    ).toEqual({ etaHours: 5, speedOverGroundKt: 3 });
  });

  it("uses boat speed to cancel a beam current", () => {
    const result = calculateWaypointEtaCurrentCorrected({
      boatSpeedKt: 5,
      courseDeg: 0,
      currentKt: 4,
      currentSetDeg: 90,
      distanceNm: 25,
    });
    expect(result!.speedOverGroundKt).toBeCloseTo(3, 12);
    expect(result!.etaHours).toBeCloseTo(25 / 3, 12);
  });

  it("rejects a cross-current stronger than boat speed", () => {
    expect(
      calculateWaypointEtaCurrentCorrected({
        boatSpeedKt: 4,
        courseDeg: 0,
        currentKt: 5,
        currentSetDeg: 90,
        distanceNm: 10,
      }),
    ).toBeNull();
  });

  it("rejects a foul current that prevents progress", () => {
    expect(
      calculateWaypointEtaCurrentCorrected({
        boatSpeedKt: 4,
        courseDeg: 0,
        currentKt: 4,
        currentSetDeg: 180,
        distanceNm: 10,
      }),
    ).toBeNull();
  });

  it("returns an infinite-free ETA for zero current", () => {
    expect(
      calculateWaypointEtaCurrentCorrected({
        boatSpeedKt: 4,
        courseDeg: 200,
        currentKt: 0,
        currentSetDeg: 100,
        distanceNm: 8,
      }),
    ).toEqual({ etaHours: 2, speedOverGroundKt: 4 });
  });

  it.each([
    [0, 1, 0, 0, 1],
    [4, -1, 0, 0, 1],
    [-4, 1, 0, 0, 1],
    [4, 1, 0, 0, 0],
    [4, 1, 361, 0, 1],
    [4, 1, 0, -1, 1],
  ])(
    "rejects non-positive speeds or distances and out of range courses",
    (boatSpeedKt, currentKt, currentSetDeg, courseDeg, distanceNm) => {
      expect(
        calculateWaypointEtaCurrentCorrected({
          boatSpeedKt,
          courseDeg,
          currentKt,
          currentSetDeg,
          distanceNm,
        }),
      ).toBeNull();
      expect(
        runWaypointEtaCurrentCorrected({
          boatSpeedKt,
          courseDeg,
          currentKt,
          currentSetDeg,
          distanceNm,
        }).ok,
      ).toBe(false);
    },
  );

  it("rejects negative currents at the schema level", () => {
    expect(
      runWaypointEtaCurrentCorrected({
        boatSpeedKt: 4,
        courseDeg: 0,
        currentKt: -1,
        currentSetDeg: 0,
        distanceNm: 4,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runWaypointEtaCurrentCorrected({
        boatSpeedKt: 4,
        courseDeg: 0,
        currentKt: 1,
        currentSetDeg: 0,
        distanceNm: 4,
        tide: "flood",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(runWaypointEtaCurrentCorrected(null as never).ok).toBe(false);
  });
});
