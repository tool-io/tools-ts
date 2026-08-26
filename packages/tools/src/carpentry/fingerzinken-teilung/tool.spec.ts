import { describe, expect, it } from "vitest";
import {
  boxJointPitchExample,
  boxJointPitchTool,
  runBoxJointPitch,
} from "./tool.js";

describe("Box Joint Pitch Calculator", () => {
  it("computes the canonical example", () =>
    expect(runBoxJointPitch(boxJointPitchExample.input)).toEqual({
      ok: true,
      output: { adjustedPitchMm: 12.5, pinCount: 8 },
    }));

  it.each([
    [100, 13, 8, 12.5],
    [95, 12, 8, 11.875],
    [100, 60, 2, 50],
    [30, 100, 2, 15],
  ])(
    "fits %p mm at %p mm pitch to %p pins of %p mm",
    (jointWidthMm, desiredPitchMm, pinCount, adjustedPitchMm) =>
      expect(runBoxJointPitch({ jointWidthMm, desiredPitchMm })).toEqual({
        ok: true,
        output: { adjustedPitchMm, pinCount },
      }),
  );

  it("never returns fewer than two pins", () =>
    expect(runBoxJointPitch({ jointWidthMm: 10, desiredPitchMm: 90 })).toEqual({
      ok: true,
      output: { adjustedPitchMm: 5, pinCount: 2 },
    }));

  it("distributes the width exactly across the pins", () => {
    const result = runBoxJointPitch({ jointWidthMm: 137, desiredPitchMm: 20 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        adjustedPitchMm: number;
        pinCount: number;
      };
      expect(output.pinCount * output.adjustedPitchMm).toBe(137);
    }
  });

  it("rejects zero and negative joint widths", () => {
    const zero = runBoxJointPitch({ jointWidthMm: 0, desiredPitchMm: 12 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "jointWidthMm",
        message: "Joint width must be positive.",
      });
    expect(
      runBoxJointPitch({ jointWidthMm: -100, desiredPitchMm: 12 }).ok,
    ).toBe(false);
  });

  it("rejects zero and negative pitches", () => {
    const zero = runBoxJointPitch({ jointWidthMm: 100, desiredPitchMm: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "desiredPitchMm",
        message: "Desired pitch must be positive.",
      });
    expect(
      runBoxJointPitch({ jointWidthMm: 100, desiredPitchMm: -12 }).ok,
    ).toBe(false);
  });

  it("rejects non-finite and non-numeric inputs", () => {
    expect(
      runBoxJointPitch({ jointWidthMm: Number.NaN, desiredPitchMm: 12 }).ok,
    ).toBe(false);
    expect(
      runBoxJointPitch({ jointWidthMm: 100, desiredPitchMm: "12" } as never).ok,
    ).toBe(false);
  });

  it("rejects missing inputs", () => {
    expect(runBoxJointPitch({}).ok).toBe(false);
    expect(runBoxJointPitch({ jointWidthMm: 100 }).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runBoxJointPitch({
      jointWidthMm: 100,
      desiredPitchMm: 12,
      bladeKerfMm: 3,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(boxJointPitchExample))).toEqual(
      boxJointPitchExample,
    );
    expect(boxJointPitchTool.id).toBe("carpentry/fingerzinken-teilung");
    expect(boxJointPitchTool.execution).toEqual({ kind: "pure" });
  });
});
