import { describe, expect, it } from "vitest";
import {
  doorLeafThicknessExample,
  doorLeafThicknessTool,
  runDoorLeafThickness,
} from "./tool.js";

describe("Door Leaf Thickness Check", () => {
  it("computes the canonical example", () =>
    expect(runDoorLeafThickness(doorLeafThicknessExample.input)).toEqual({
      ok: true,
      output: { isStandardThickness: true },
    }));

  it.each([40, 42, 44])(
    "accepts %p mm as standard thickness",
    (leafThicknessMm) =>
      expect(runDoorLeafThickness({ leafThicknessMm })).toEqual({
        ok: true,
        output: { isStandardThickness: true },
      }),
  );

  it.each([39, 45])("rejects %p mm as non-standard", (leafThicknessMm) =>
    expect(runDoorLeafThickness({ leafThicknessMm })).toEqual({
      ok: true,
      output: { isStandardThickness: false },
    }),
  );

  it("accepts the smallest supported thickness", () =>
    expect(runDoorLeafThickness({ leafThicknessMm: 25 })).toEqual({
      ok: true,
      output: { isStandardThickness: false },
    }));

  it("accepts the largest supported thickness", () =>
    expect(runDoorLeafThickness({ leafThicknessMm: 70 })).toEqual({
      ok: true,
      output: { isStandardThickness: false },
    }));

  it("rejects thicknesses below 25 mm", () =>
    expect(runDoorLeafThickness({ leafThicknessMm: 24.5 }).ok).toBe(false));

  it("rejects thicknesses above 70 mm", () => {
    const result = runDoorLeafThickness({ leafThicknessMm: 71 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-finite thicknesses", () => {
    expect(runDoorLeafThickness({ leafThicknessMm: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runDoorLeafThickness({ leafThicknessMm: Number.NEGATIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects a missing thickness", () =>
    expect(runDoorLeafThickness({}).ok).toBe(false));

  it("rejects non-numeric thicknesses", () =>
    expect(runDoorLeafThickness({ leafThicknessMm: "40" } as never).ok).toBe(
      false,
    ));

  it("rejects unknown input fields", () => {
    const result = runDoorLeafThickness({
      leafThicknessMm: 40,
      widthMm: 625,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(doorLeafThicknessExample))).toEqual(
      doorLeafThicknessExample,
    );
    expect(doorLeafThicknessTool.id).toBe("carpentry/tuer-blatt-dicke-40-44mm");
    expect(doorLeafThicknessTool.execution).toEqual({ kind: "pure" });
  });
});
