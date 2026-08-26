import { describe, expect, it } from "vitest";
import {
  handrailDiameterExample,
  handrailDiameterTool,
  runHandrailDiameter,
} from "./tool.js";

describe("Handrail Diameter Check", () => {
  it("computes the canonical example", () =>
    expect(runHandrailDiameter(handrailDiameterExample.input)).toEqual({
      ok: true,
      output: { gripDeviationMm: 4, isComfortableGrip: false },
    }));

  it.each([42, 45, 48])("accepts %p mm as a comfortable grip", (diameterMm) =>
    expect(runHandrailDiameter({ diameterMm })).toEqual({
      ok: true,
      output: { gripDeviationMm: 0, isComfortableGrip: true },
    }),
  );

  it("reports the deviation below the range", () =>
    expect(runHandrailDiameter({ diameterMm: 41.5 })).toEqual({
      ok: true,
      output: { gripDeviationMm: 0.5, isComfortableGrip: false },
    }));

  it("reports the deviation above the range", () =>
    expect(runHandrailDiameter({ diameterMm: 48.5 })).toEqual({
      ok: true,
      output: { gripDeviationMm: 0.5, isComfortableGrip: false },
    }));

  it("accepts the smallest supported diameter", () =>
    expect(runHandrailDiameter({ diameterMm: 20 })).toEqual({
      ok: true,
      output: { gripDeviationMm: 22, isComfortableGrip: false },
    }));

  it("accepts the largest supported diameter", () =>
    expect(runHandrailDiameter({ diameterMm: 80 })).toEqual({
      ok: true,
      output: { gripDeviationMm: 32, isComfortableGrip: false },
    }));

  it("rejects diameters below 20 mm", () => {
    const result = runHandrailDiameter({ diameterMm: 19 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects diameters above 80 mm", () =>
    expect(runHandrailDiameter({ diameterMm: 80.5 }).ok).toBe(false));

  it("rejects non-finite diameters", () => {
    expect(runHandrailDiameter({ diameterMm: Number.NaN }).ok).toBe(false);
    expect(
      runHandrailDiameter({ diameterMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects a missing diameter", () => {
    const result = runHandrailDiameter({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runHandrailDiameter({
      diameterMm: 45,
      wood: "oak",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(handrailDiameterExample))).toEqual(
      handrailDiameterExample,
    );
    expect(handrailDiameterTool.id).toBe(
      "carpentry/handlauf-durchmesser-42-48mm",
    );
    expect(handrailDiameterTool.execution).toEqual({ kind: "pure" });
  });
});
