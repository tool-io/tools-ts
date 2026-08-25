import { describe, expect, it } from "vitest";
import {
  oakStaveSurfaceAreaExample,
  oakStaveSurfaceAreaTool,
  runOakStaveSurfaceArea,
} from "./tool.js";

describe("oakStaveSurfaceAreaTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runOakStaveSurfaceArea(oakStaveSurfaceAreaExample.input)).toEqual({
      ok: true,
      output: oakStaveSurfaceAreaExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(oakStaveSurfaceAreaExample))).toEqual(
      oakStaveSurfaceAreaExample,
    );
    expect(oakStaveSurfaceAreaTool.contractVersion).toBe(1);
    expect(oakStaveSurfaceAreaTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runOakStaveSurfaceArea(null).ok).toBe(false);
    expect(
      runOakStaveSurfaceArea({
        ...oakStaveSurfaceAreaExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("includes the two end faces", () => {
    expect(
      runOakStaveSurfaceArea({ lengthCm: 10, thicknessCm: 2, widthCm: 3 }),
    ).toEqual({ ok: true, output: { wettedAreaCm2: 112 } });
  });
});
