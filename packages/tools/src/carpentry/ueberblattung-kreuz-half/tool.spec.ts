import { describe, expect, it } from "vitest";
import {
  halfLapCrossJointExample,
  halfLapCrossJointTool,
  runHalfLapCrossJoint,
} from "./tool.js";

describe("Half-Lap Cross Joint Calculator", () => {
  it("computes the canonical example", () =>
    expect(runHalfLapCrossJoint(halfLapCrossJointExample.input)).toEqual({
      ok: true,
      output: { cutDepthMm: 9.5, lapThicknessMm: 9.5 },
    }));

  it.each([
    [18, 9],
    [24, 12],
    [25.4, 12.7],
  ])("halves %p mm boards at %p mm", (boardThicknessMm, expected) =>
    expect(runHalfLapCrossJoint({ boardThicknessMm })).toEqual({
      ok: true,
      output: { cutDepthMm: expected, lapThicknessMm: expected },
    }),
  );

  it("keeps cut depth equal to lap thickness", () => {
    const result = runHalfLapCrossJoint({ boardThicknessMm: 30 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        cutDepthMm: number;
        lapThicknessMm: number;
      };
      expect(output.cutDepthMm).toBe(output.lapThicknessMm);
    }
  });

  it("rejects zero and negative board thickness", () => {
    const zero = runHalfLapCrossJoint({ boardThicknessMm: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "boardThicknessMm",
        message: "Board thickness must be positive.",
      });
    expect(runHalfLapCrossJoint({ boardThicknessMm: -19 }).ok).toBe(false);
  });

  it("rejects non-finite board thickness", () => {
    expect(runHalfLapCrossJoint({ boardThicknessMm: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runHalfLapCrossJoint({ boardThicknessMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric board thickness", () =>
    expect(runHalfLapCrossJoint({ boardThicknessMm: "19" } as never).ok).toBe(
      false,
    ));

  it("rejects a missing board thickness", () => {
    const result = runHalfLapCrossJoint({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runHalfLapCrossJoint({
      boardThicknessMm: 19,
      boardWidthMm: 140,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(halfLapCrossJointExample))).toEqual(
      halfLapCrossJointExample,
    );
    expect(halfLapCrossJointTool.id).toBe("carpentry/ueberblattung-kreuz-half");
    expect(halfLapCrossJointTool.execution).toEqual({ kind: "pure" });
  });
});
