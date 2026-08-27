import { describe, expect, it } from "vitest";
import { runWithersHeightWeight } from "./tool.js";

describe("Withers Height Weight Class", () => {
  it("classifies one hundred ten centimetres as small", () =>
    expect(runWithersHeightWeight({ withersCm: 110 })).toEqual({
      ok: true,
      output: { sizeClass: "small" },
    }));
  it("classifies counts just below the medium cut-off as small", () =>
    expect(runWithersHeightWeight({ withersCm: 119.9 })).toEqual({
      ok: true,
      output: { sizeClass: "small" },
    }));
  it("classifies the medium cut-off itself as medium", () =>
    expect(runWithersHeightWeight({ withersCm: 120 })).toEqual({
      ok: true,
      output: { sizeClass: "medium" },
    }));
  it("classifies the upper medium boundary as medium", () =>
    expect(runWithersHeightWeight({ withersCm: 145 })).toEqual({
      ok: true,
      output: { sizeClass: "medium" },
    }));
  it("classifies just above the large cut-off as large", () =>
    expect(runWithersHeightWeight({ withersCm: 145.1 })).toEqual({
      ok: true,
      output: { sizeClass: "large" },
    }));
  it("rejects zero withers height", () =>
    expect(runWithersHeightWeight({ withersCm: 0 }).ok).toBe(false));
  it("rejects negative withers height", () =>
    expect(runWithersHeightWeight({ withersCm: -120 }).ok).toBe(false));
});
