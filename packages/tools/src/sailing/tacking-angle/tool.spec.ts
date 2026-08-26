import { describe, expect, it } from "vitest";
import { runTackingAngle, tackingAngleExample } from "./tool.js";

describe("tacking angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTackingAngle(tackingAngleExample.input)).toEqual({
      ok: true,
      output: tackingAngleExample.output,
    });
  });

  it("doubles the close-hauled angle", () => {
    const result = runTackingAngle({ closeHauledAngleDeg: 37 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.tackingAngle).toBe(74);
  });

  it("accepts the inclusive lower boundary of ten degrees", () => {
    expect(runTackingAngle({ closeHauledAngleDeg: 10 })).toEqual({
      ok: true,
      output: { tackingAngle: 20 },
    });
  });

  it("accepts the inclusive upper boundary of eighty degrees", () => {
    expect(runTackingAngle({ closeHauledAngleDeg: 80 })).toEqual({
      ok: true,
      output: { tackingAngle: 160 },
    });
  });

  it("supports fractional close-hauled angles", () => {
    const result = runTackingAngle({ closeHauledAngleDeg: 22.5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.tackingAngle).toBe(45);
  });

  it("rejects angles below ten degrees through validation", () => {
    for (const closeHauledAngleDeg of [0, 9.9])
      expect(runTackingAngle({ closeHauledAngleDeg })).toMatchObject({
        error: {
          issues: [{ code: "invalid_field", field: "closeHauledAngleDeg" }],
        },
        ok: false,
      });
  });

  it("rejects angles above eighty degrees through validation", () => {
    for (const closeHauledAngleDeg of [80.1, 90])
      expect(runTackingAngle({ closeHauledAngleDeg })).toMatchObject({
        error: {
          issues: [{ code: "invalid_field", field: "closeHauledAngleDeg" }],
        },
        ok: false,
      });
  });

  it("rejects missing and non-finite inputs", () => {
    expect(runTackingAngle({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "closeHauledAngleDeg" }],
      },
      ok: false,
    });
    expect(runTackingAngle({ closeHauledAngleDeg: Number.NaN }).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runTackingAngle({ closeHauledAngleDeg: 45, windKt: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "windKt" }] },
      ok: false,
    });
  });
});
