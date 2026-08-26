import { describe, expect, it } from "vitest";
import { runVmgToWaypoint, vmgToWaypointExample } from "./tool.js";

describe("vmg to waypoint calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVmgToWaypoint(vmgToWaypointExample.input)).toEqual({
      ok: true,
      output: vmgToWaypointExample.output,
    });
  });

  it("returns full speed when headed directly at the waypoint", () => {
    const r = runVmgToWaypoint({
      boatSpeedKt: 10,
      waypointBearingOffsetDeg: 0,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.vmgKt).toBe(10);
  });

  it("returns zero at a ninety-degree offset", () => {
    const r = runVmgToWaypoint({
      boatSpeedKt: 10,
      waypointBearingOffsetDeg: 90,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.vmgKt).toBeCloseTo(0, 9);
  });
});
