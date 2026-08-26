import { describe, expect, it } from "vitest";
import {
  calculateReefPercentage,
  reefPercentageExample,
  runReefPercentage,
} from "./tool.js";

describe("reef percentage calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runReefPercentage(reefPercentageExample.input)).toEqual({
      ok: true,
      output: reefPercentageExample.output,
    });
  });

  it("equals one minus the area ratio times one hundred", () => {
    expect(
      calculateReefPercentage({ fullAreaM2: 42.5, reefedAreaM2: 13.7 }),
    ).toEqual({ reefPercentage: (1 - 13.7 / 42.5) * 100 });
    expect(
      calculateReefPercentage({ fullAreaM2: 40, reefedAreaM2: 30 }),
    ).toEqual({ reefPercentage: 25 });
  });

  it("returns one hundred percent with no sail set", () => {
    expect(runReefPercentage({ fullAreaM2: 50, reefedAreaM2: 0 })).toEqual({
      ok: true,
      output: { reefPercentage: 100 },
    });
  });

  it("returns zero percent when reefed area equals full area", () => {
    expect(runReefPercentage({ fullAreaM2: 50, reefedAreaM2: 50 })).toEqual({
      ok: true,
      output: { reefPercentage: 0 },
    });
  });

  it("keeps raw results without rounding", () => {
    expect(calculateReefPercentage({ fullAreaM2: 3, reefedAreaM2: 1 })).toEqual(
      { reefPercentage: (1 - 1 / 3) * 100 },
    );
  });

  it("handles tiny areas", () => {
    expect(
      runReefPercentage({ fullAreaM2: 0.02, reefedAreaM2: 0.005 }),
    ).toEqual({
      ok: true,
      output: { reefPercentage: 75 },
    });
  });

  it("rejects non-positive full areas through execution", () => {
    for (const bad of [-10, 0])
      expect(runReefPercentage({ fullAreaM2: bad, reefedAreaM2: 5 }).ok).toBe(
        false,
      );
  });

  it("rejects negative reefed areas through execution", () => {
    expect(runReefPercentage({ fullAreaM2: 50, reefedAreaM2: -1 }).ok).toBe(
      false,
    );
  });

  it("rejects reefed areas larger than full area through execution", () => {
    const result = runReefPercentage({
      fullAreaM2: 50,
      reefedAreaM2: 50.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_reefed_area");
  });

  it("reports stable error codes for invalid inputs", () => {
    const areaResult = runReefPercentage({ fullAreaM2: 0, reefedAreaM2: 0 });
    expect(areaResult.ok).toBe(false);
    if (!areaResult.ok)
      expect(areaResult.error.issues[0]?.code).toBe("invalid_area");
    const reefedResult = runReefPercentage({
      fullAreaM2: 50,
      reefedAreaM2: 51,
    });
    expect(reefedResult.ok).toBe(false);
    if (!reefedResult.ok)
      expect(reefedResult.error.issues[0]?.code).toBe("invalid_reefed_area");
  });
});
