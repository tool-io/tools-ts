import { describe, expect, it } from "vitest";
import {
  cellMembraneStabilityExample,
  runCellMembraneStability,
} from "./tool.js";

describe("CMS Percent", () => {
  it("publishes an executable example", () =>
    expect(
      runCellMembraneStability(cellMembraneStabilityExample.input),
    ).toEqual({
      ok: true,
      output: cellMembraneStabilityExample.output,
    }));
  it("returns one hundred for identical ratios", () =>
    expect(
      runCellMembraneStability({ ratioControl: 0.7, ratioTreated: 0.7 }),
    ).toEqual({ ok: true, output: { cellMembraneStabilityPercent: 100 } }));
  it("clamps above one hundred when the control ratio dominates", () =>
    expect(
      runCellMembraneStability({ ratioControl: 1, ratioTreated: 0.5 }),
    ).toEqual({ ok: true, output: { cellMembraneStabilityPercent: 100 } }));
  it("clamps at zero for a zero control ratio", () =>
    expect(
      runCellMembraneStability({ ratioControl: 0, ratioTreated: 0.5 }),
    ).toEqual({ ok: true, output: { cellMembraneStabilityPercent: 0 } }));
  it("rejects a zero treated ratio", () =>
    expect(
      runCellMembraneStability({ ratioControl: 0.5, ratioTreated: 0 }).ok,
    ).toBe(false));
  it("rejects ratios outside zero to one", () => {
    expect(
      runCellMembraneStability({ ratioControl: 1.2, ratioTreated: 0.5 }).ok,
    ).toBe(false);
    expect(
      runCellMembraneStability({ ratioControl: 0.5, ratioTreated: -0.5 }).ok,
    ).toBe(false);
  });
});
