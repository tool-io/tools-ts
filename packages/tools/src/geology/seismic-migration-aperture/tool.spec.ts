import { describe, expect, it } from "vitest";
import {
  seismicMigrationApertureExample,
  runSeismicMigrationAperture,
} from "./tool.js";

describe("geology/seismic-migration-aperture", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSeismicMigrationAperture(seismicMigrationApertureExample.input),
    ).toEqual({ ok: true, output: seismicMigrationApertureExample.output });
  });

  it("gives zero aperture for flat reflectors and grows with dip", () => {
    const flat = runSeismicMigrationAperture({ depthM: 2000, dipAngleDeg: 0 });
    const steep = runSeismicMigrationAperture({
      depthM: 2000,
      dipAngleDeg: 60,
    });
    if (!flat.ok || !steep.ok) throw new Error("expected success");
    expect(flat.output.migrationApertureM).toBe(0);
    expect(steep.output.migrationApertureM as number).toBeGreaterThan(
      seismicMigrationApertureExample.output.migrationApertureM,
    );
  });

  it("rejects negative depth and dips of ninety degrees or more", () => {
    expect(
      runSeismicMigrationAperture({ depthM: -1, dipAngleDeg: 30 }).ok,
    ).toBe(false);
    expect(
      runSeismicMigrationAperture({ depthM: 2000, dipAngleDeg: 90 }).ok,
    ).toBe(false);
  });
});
