import { describe, expect, it } from "vitest";
import {
  tongueGrooveClearanceExample,
  tongueGrooveClearanceTool,
  runTongueGrooveClearance,
} from "./tool.js";

describe("Tongue Groove Clearance Calculator", () => {
  it("computes the canonical example", () =>
    expect(
      runTongueGrooveClearance(tongueGrooveClearanceExample.input),
    ).toEqual({ ok: true, output: { grooveWidthMm: 12.2 } }));

  it("adds exactly 0.2 millimeters of clearance", () =>
    expect(runTongueGrooveClearance({ tongueThicknessMm: 22 })).toEqual({
      ok: true,
      output: { grooveWidthMm: 22.2 },
    }));

  it("accepts fractional tongue thicknesses", () =>
    expect(runTongueGrooveClearance({ tongueThicknessMm: 19.5 })).toEqual({
      ok: true,
      output: { grooveWidthMm: 19.7 },
    }));

  it("accepts very small positive tongue thicknesses", () =>
    expect(runTongueGrooveClearance({ tongueThicknessMm: 0.2 })).toEqual({
      ok: true,
      output: { grooveWidthMm: 0.4 },
    }));

  it("rejects a zero tongue thickness", () => {
    const result = runTongueGrooveClearance({ tongueThicknessMm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "tongueThicknessMm",
        message: "Tongue thickness must be greater than zero.",
      });
  });

  it("rejects negative tongue thicknesses", () =>
    expect(runTongueGrooveClearance({ tongueThicknessMm: -12 }).ok).toBe(
      false,
    ));

  it("rejects non-finite tongue thicknesses", () =>
    expect(
      runTongueGrooveClearance({
        tongueThicknessMm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false));

  it("rejects a missing tongue thickness", () => {
    const result = runTongueGrooveClearance({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runTongueGrooveClearance({ grooveWidthMm: 12.2 } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable example with the tool id", () => {
    expect(JSON.parse(JSON.stringify(tongueGrooveClearanceExample))).toEqual(
      tongueGrooveClearanceExample,
    );
    expect(tongueGrooveClearanceTool.id).toBe("carpentry/feder-nut-spiel-02mm");
    expect(tongueGrooveClearanceTool.execution).toEqual({ kind: "pure" });
  });
});
