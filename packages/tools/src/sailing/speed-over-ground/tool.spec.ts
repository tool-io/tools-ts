import { describe, expect, it } from "vitest";
import { runSpeedOverGround, speedOverGroundExample } from "./tool.js";

describe("Speed Over Ground Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSpeedOverGround(speedOverGroundExample.input)).toEqual({
      ok: true,
      output: speedOverGroundExample.output,
    });
  });

  it("keeps the vessel speed with no current", () => {
    expect(
      runSpeedOverGround({
        currentSetDeg: 90,
        currentSpeedKt: 0,
        vesselCourseDeg: 0,
        vesselSpeedKt: 10,
      }),
    ).toEqual({ ok: true, output: { speedOverGroundKt: 10 } });
  });

  it("adds a perpendicular current vectorially", () => {
    expect(
      runSpeedOverGround({
        currentSetDeg: 90,
        currentSpeedKt: 4,
        vesselCourseDeg: 0,
        vesselSpeedKt: 3,
      }),
    ).toEqual({ ok: true, output: { speedOverGroundKt: 5 } });
  });

  it("subtracts an opposing current", () => {
    expect(
      runSpeedOverGround({
        currentSetDeg: 180,
        currentSpeedKt: 2.5,
        vesselCourseDeg: 0,
        vesselSpeedKt: 10,
      }),
    ).toEqual({ ok: true, output: { speedOverGroundKt: 7.5 } });
  });

  it("allows zero speed when vessel and current are still", () => {
    expect(
      runSpeedOverGround({
        currentSetDeg: 180,
        currentSpeedKt: 0,
        vesselCourseDeg: 45,
        vesselSpeedKt: 0,
      }),
    ).toEqual({ ok: true, output: { speedOverGroundKt: 0 } });
  });

  it("is independent of the order of the two vectors", () => {
    const first = runSpeedOverGround({
      currentSetDeg: 180,
      currentSpeedKt: 2,
      vesselCourseDeg: 90,
      vesselSpeedKt: 5,
    });
    const second = runSpeedOverGround({
      currentSetDeg: 90,
      currentSpeedKt: 5,
      vesselCourseDeg: 180,
      vesselSpeedKt: 2,
    });
    if (!first.ok || !second.ok) throw new Error("expected success");
    expect(first.output.speedOverGroundKt).toBe(
      second.output.speedOverGroundKt,
    );
    expect(first.output.speedOverGroundKt).toBeCloseTo(5.385164807134504, 9);
  });

  it("rejects negative speeds", () => {
    expect(
      runSpeedOverGround({
        currentSetDeg: 0,
        currentSpeedKt: 0,
        vesselCourseDeg: 0,
        vesselSpeedKt: -1,
      }).ok,
    ).toBe(false);
  });

  it("rejects a current set above 360 degrees", () => {
    expect(
      runSpeedOverGround({
        currentSetDeg: 361,
        currentSpeedKt: 1,
        vesselCourseDeg: 0,
        vesselSpeedKt: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite input", () => {
    expect(
      runSpeedOverGround({
        currentSetDeg: 0,
        currentSpeedKt: Number.POSITIVE_INFINITY,
        vesselCourseDeg: 0,
        vesselSpeedKt: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing input fields", () => {
    expect(
      runSpeedOverGround({ vesselCourseDeg: 0, vesselSpeedKt: 1 }).ok,
    ).toBe(false);
  });
});
