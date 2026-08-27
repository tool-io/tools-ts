import { describe, expect, it } from "vitest";
import { runVitalCapacity, vitalCapacityExample } from "./tool.js";

describe("Vital Capacity", () => {
  it("publishes an executable example", () =>
    expect(runVitalCapacity(vitalCapacityExample.input)).toEqual({
      ok: true,
      output: vitalCapacityExample.output,
    }));
  it("sums the three lung volumes", () =>
    expect(
      runVitalCapacity({
        expiratoryReserveL: 0.75,
        inspiratoryReserveL: 1.5,
        tidalVolumeL: 0.5,
      }),
    ).toEqual({ ok: true, output: { vitalCapacityL: 2.75 } }));
  it("accepts whole-litre volumes", () =>
    expect(
      runVitalCapacity({
        expiratoryReserveL: 1,
        inspiratoryReserveL: 2,
        tidalVolumeL: 0.5,
      }),
    ).toEqual({ ok: true, output: { vitalCapacityL: 3.5 } }));
  it("yields zero when all volumes are zero", () =>
    expect(
      runVitalCapacity({
        expiratoryReserveL: 0,
        inspiratoryReserveL: 0,
        tidalVolumeL: 0,
      }),
    ).toEqual({ ok: true, output: { vitalCapacityL: 0 } }));
  it("rejects negative volumes", () => {
    expect(
      runVitalCapacity({
        expiratoryReserveL: -1,
        inspiratoryReserveL: 2.5,
        tidalVolumeL: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runVitalCapacity({
        expiratoryReserveL: 1.5,
        inspiratoryReserveL: -0.5,
        tidalVolumeL: 0.5,
      }).ok,
    ).toBe(false);
  });
  it("rejects missing inputs", () =>
    expect(runVitalCapacity({ tidalVolumeL: 0.5 }).ok).toBe(false));
});
