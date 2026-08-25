import { describe, expect, it } from "vitest";
import { runErgotAlkaloidAssayRecorder } from "./tool.js";
describe("Ergot Alkaloid Assay", () => {
  it("records the assay concentration", () =>
    expect(runErgotAlkaloidAssayRecorder({ alkaloidPpm: 250 })).toEqual({
      ok: true,
      output: { alkaloidPpm: 250 },
    }));
  it("preserves values below one hundred ppm", () =>
    expect(runErgotAlkaloidAssayRecorder({ alkaloidPpm: 99 })).toEqual({
      ok: true,
      output: { alkaloidPpm: 99 },
    }));
  it("preserves exactly one hundred ppm", () =>
    expect(runErgotAlkaloidAssayRecorder({ alkaloidPpm: 100 })).toEqual({
      ok: true,
      output: { alkaloidPpm: 100 },
    }));
  it("preserves five hundred ppm", () =>
    expect(runErgotAlkaloidAssayRecorder({ alkaloidPpm: 500 })).toEqual({
      ok: true,
      output: { alkaloidPpm: 500 },
    }));
  it("does not invent a category above five hundred ppm", () =>
    expect(runErgotAlkaloidAssayRecorder({ alkaloidPpm: 500.5 })).toEqual({
      ok: true,
      output: { alkaloidPpm: 500.5 },
    }));
  it("records zero", () =>
    expect(runErgotAlkaloidAssayRecorder({ alkaloidPpm: 0 })).toEqual({
      ok: true,
      output: { alkaloidPpm: 0 },
    }));
  it("records large values without interpreting toxicity", () =>
    expect(runErgotAlkaloidAssayRecorder({ alkaloidPpm: 10000 })).toEqual({
      ok: true,
      output: { alkaloidPpm: 10000 },
    }));
  it("rejects negative concentrations", () =>
    expect(runErgotAlkaloidAssayRecorder({ alkaloidPpm: -1 }).ok).toBe(false));
});
