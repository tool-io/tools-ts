import { describe, expect, it } from "vitest";
import {
  runSkirtingMiterAngle,
  skirtingMiterAngleExample,
  skirtingMiterAngleTool,
} from "./tool.js";

describe("Skirting Miter Angle Calculator", () => {
  it("computes the canonical example", () =>
    expect(runSkirtingMiterAngle(skirtingMiterAngleExample.input)).toEqual({
      ok: true,
      output: { miterAngleDeg: 45 },
    }));

  it("applies the default 90 degree corner", () =>
    expect(runSkirtingMiterAngle({})).toEqual({
      ok: true,
      output: { miterAngleDeg: 45 },
    }));

  it("miters the smallest supported corner of 60 degrees to 60 degrees", () =>
    expect(runSkirtingMiterAngle({ cornerAngleDeg: 60 })).toEqual({
      ok: true,
      output: { miterAngleDeg: 60 },
    }));

  it("miters a flat 180 degree corner to zero degrees", () =>
    expect(runSkirtingMiterAngle({ cornerAngleDeg: 180 })).toEqual({
      ok: true,
      output: { miterAngleDeg: 0 },
    }));

  it("computes fractional angles for obtuse corners", () =>
    expect(runSkirtingMiterAngle({ cornerAngleDeg: 135 })).toEqual({
      ok: true,
      output: { miterAngleDeg: 22.5 },
    }));

  it.each([
    [75, 52.5],
    [90, 45],
    [120, 30],
  ])("splits a %p degree corner into %p degree miters", (corner, miter) =>
    expect(runSkirtingMiterAngle({ cornerAngleDeg: corner })).toEqual({
      ok: true,
      output: { miterAngleDeg: miter },
    }),
  );

  it("rejects corner angles below 60 degrees", () => {
    const result = runSkirtingMiterAngle({ cornerAngleDeg: 59.5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects corner angles above 180 degrees", () =>
    expect(runSkirtingMiterAngle({ cornerAngleDeg: 181 }).ok).toBe(false));

  it("rejects non-finite corner angles", () => {
    expect(runSkirtingMiterAngle({ cornerAngleDeg: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runSkirtingMiterAngle({ cornerAngleDeg: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric corner angles", () =>
    expect(runSkirtingMiterAngle({ cornerAngleDeg: "90" } as never).ok).toBe(
      false,
    ));

  it("rejects unknown input fields", () => {
    const result = runSkirtingMiterAngle({
      cornerAngleDeg: 90,
      bladeKerfMm: 3,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(skirtingMiterAngleExample))).toEqual(
      skirtingMiterAngleExample,
    );
    expect(skirtingMiterAngleTool.id).toBe(
      "carpentry/parkett-sockelleiste-gehrung-45grad",
    );
    expect(skirtingMiterAngleTool.execution).toEqual({ kind: "pure" });
    expect(
      skirtingMiterAngleTool.inputSchema.properties?.cornerAngleDeg.default,
    ).toBe(90);
  });
});
