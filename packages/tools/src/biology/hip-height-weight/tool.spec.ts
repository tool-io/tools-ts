import { describe, expect, it } from "vitest";
import { runHipHeightWeight } from "./tool.js";

describe("Hip Height Index", () => {
  it("indexes hip height over girth times one hundred", () =>
    expect(runHipHeightWeight({ girthCm: 175, hipHeightCm: 140 })).toEqual({
      ok: true,
      output: { hipHeightIndex: 80 },
    }));
  it("returns one hundred when hip height equals girth", () =>
    expect(runHipHeightWeight({ girthCm: 180, hipHeightCm: 180 })).toEqual({
      ok: true,
      output: { hipHeightIndex: 100 },
    }));
  it("supports fractional indices", () => {
    const result = runHipHeightWeight({ girthCm: 180, hipHeightCm: 150 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.hipHeightIndex).toBeCloseTo(83.3333, 3);
  });
  it("rejects zero hip height", () =>
    expect(runHipHeightWeight({ girthCm: 175, hipHeightCm: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative hip height", () =>
    expect(runHipHeightWeight({ girthCm: 175, hipHeightCm: -140 }).ok).toBe(
      false,
    ));
  it("rejects zero girth", () =>
    expect(runHipHeightWeight({ girthCm: 0, hipHeightCm: 140 }).ok).toBe(
      false,
    ));
});
