import { describe, expect, it } from "vitest";
import { freeSpacePathLossExample, runFreeSpacePathLoss } from "./tool.js";

describe("FSPL Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runFreeSpacePathLoss(freeSpacePathLossExample.input)).toEqual({
      ok: true,
      output: { pathLossDb: 112.44 },
    }));
  it("reports the constant term for unit distance and frequency", () =>
    expect(runFreeSpacePathLoss({ distanceKm: 1, frequencyMHz: 1 })).toEqual({
      ok: true,
      output: { pathLossDb: 32.44 },
    }));
  it("rejects zero distance", () =>
    expect(runFreeSpacePathLoss({ distanceKm: 0, frequencyMHz: 1000 }).ok).toBe(
      false,
    ));
  it("rejects zero frequency", () =>
    expect(runFreeSpacePathLoss({ distanceKm: 10, frequencyMHz: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative frequency", () =>
    expect(
      runFreeSpacePathLoss({ distanceKm: 10, frequencyMHz: -900 }).ok,
    ).toBe(false));
  it("rejects non-finite frequency", () =>
    expect(
      runFreeSpacePathLoss({ distanceKm: 10, frequencyMHz: Number.NaN }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "frequencyMHz" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runFreeSpacePathLoss({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "distanceKm" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runFreeSpacePathLoss({
        ...freeSpacePathLossExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
