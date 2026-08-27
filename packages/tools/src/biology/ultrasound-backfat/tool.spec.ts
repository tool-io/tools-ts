import { describe, expect, it } from "vitest";
import { runUltrasoundBackfat } from "./tool.js";

describe("Backfat Class Lookup", () => {
  it("classifies zero millimetres as lean", () =>
    expect(runUltrasoundBackfat({ backfatMm: 0 })).toEqual({
      ok: true,
      output: { finishClass: "lean" },
    }));
  it("classifies counts just below six millimetres as lean", () =>
    expect(runUltrasoundBackfat({ backfatMm: 5.9 })).toEqual({
      ok: true,
      output: { finishClass: "lean" },
    }));
  it("classifies the optimal lower boundary as optimal", () =>
    expect(runUltrasoundBackfat({ backfatMm: 6 })).toEqual({
      ok: true,
      output: { finishClass: "optimal" },
    }));
  it("classifies the optimal upper boundary as optimal", () =>
    expect(runUltrasoundBackfat({ backfatMm: 15 })).toEqual({
      ok: true,
      output: { finishClass: "optimal" },
    }));
  it("classifies just above fifteen millimetres as over-finished", () =>
    expect(runUltrasoundBackfat({ backfatMm: 15.1 })).toEqual({
      ok: true,
      output: { finishClass: "over-finished" },
    }));
  it("classifies the maximum measurement as over-finished", () =>
    expect(runUltrasoundBackfat({ backfatMm: 30 })).toEqual({
      ok: true,
      output: { finishClass: "over-finished" },
    }));
  it("rejects measurements above thirty millimetres", () =>
    expect(runUltrasoundBackfat({ backfatMm: 30.5 }).ok).toBe(false));
  it("rejects negative measurements", () =>
    expect(runUltrasoundBackfat({ backfatMm: -0.5 }).ok).toBe(false));
});
