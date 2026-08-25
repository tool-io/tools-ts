import { describe, expect, it } from "vitest";
import { beaufortScaleLookupExample, runBeaufortScaleLookup } from "./tool.js";

describe("Beaufort Scale Lookup", () => {
  it("calculates the canonical example exactly", () => {
    expect(runBeaufortScaleLookup(beaufortScaleLookupExample.input)).toEqual({
      ok: true,
      output: { beaufortForce: 4 },
    });
  });

  it("classifies calm air as force zero", () => {
    expect(runBeaufortScaleLookup({ windSpeedKt: 0 })).toEqual({
      ok: true,
      output: { beaufortForce: 0 },
    });
  });

  it("maps three knots to force one and just above to force two", () => {
    expect(runBeaufortScaleLookup({ windSpeedKt: 3 })).toEqual({
      ok: true,
      output: { beaufortForce: 1 },
    });
    expect(runBeaufortScaleLookup({ windSpeedKt: 3.1 })).toEqual({
      ok: true,
      output: { beaufortForce: 2 },
    });
  });

  it("treats the first upper bound inclusively", () => {
    expect(runBeaufortScaleLookup({ windSpeedKt: 1 })).toEqual({
      ok: true,
      output: { beaufortForce: 0 },
    });
    expect(runBeaufortScaleLookup({ windSpeedKt: 1.1 })).toEqual({
      ok: true,
      output: { beaufortForce: 1 },
    });
  });

  it("keeps thirty-three knots at force seven and just above it at eight", () => {
    expect(runBeaufortScaleLookup({ windSpeedKt: 33 })).toEqual({
      ok: true,
      output: { beaufortForce: 7 },
    });
    expect(runBeaufortScaleLookup({ windSpeedKt: 33.1 })).toEqual({
      ok: true,
      output: { beaufortForce: 8 },
    });
  });

  it("keeps sixty-three knots at force eleven and above it at twelve", () => {
    expect(runBeaufortScaleLookup({ windSpeedKt: 63 })).toEqual({
      ok: true,
      output: { beaufortForce: 11 },
    });
    expect(runBeaufortScaleLookup({ windSpeedKt: 63.5 })).toEqual({
      ok: true,
      output: { beaufortForce: 12 },
    });
  });

  it("rejects negative wind speed at the schema level", () => {
    expect(runBeaufortScaleLookup({ windSpeedKt: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects non-finite wind speed", () => {
    expect(runBeaufortScaleLookup({ windSpeedKt: Number.NaN }).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runBeaufortScaleLookup({ gustKt: 20, windSpeedKt: 15 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "gustKt" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runBeaufortScaleLookup(null)).toMatchObject({
      error: { issues: [{ code: "object_required", field: "" }] },
      ok: false,
    });
    expect(runBeaufortScaleLookup({}).ok).toBe(false);
  });
});
