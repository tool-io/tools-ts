import { describe, expect, it } from "vitest";
import { runKatokatzSlideFactorConverter } from "./tool.js";
describe("Kato-Katz Factor Converter", () => {
  it("converts with the standard template factor", () =>
    expect(runKatokatzSlideFactorConverter({ eggsOnSlideInt: 10 })).toEqual({
      ok: true,
      output: { eggsPerGram: 240 },
    }));
  it("yields zero without eggs", () =>
    expect(runKatokatzSlideFactorConverter({ eggsOnSlideInt: 0 })).toEqual({
      ok: true,
      output: { eggsPerGram: 0 },
    }));
  it("honors a custom template factor", () =>
    expect(
      runKatokatzSlideFactorConverter({
        eggsOnSlideInt: 8,
        templateFactorInt: 50,
      }),
    ).toEqual({ ok: true, output: { eggsPerGram: 400 } }));
  it("supports unit factors", () =>
    expect(
      runKatokatzSlideFactorConverter({
        eggsOnSlideInt: 24,
        templateFactorInt: 1,
      }),
    ).toEqual({ ok: true, output: { eggsPerGram: 24 } }));
  it("scales with heavy infections", () =>
    expect(runKatokatzSlideFactorConverter({ eggsOnSlideInt: 60 })).toEqual({
      ok: true,
      output: { eggsPerGram: 1440 },
    }));
  it("rejects negative counts", () =>
    expect(runKatokatzSlideFactorConverter({ eggsOnSlideInt: -1 }).ok).toBe(
      false,
    ));
  it("rejects zero template factors", () =>
    expect(
      runKatokatzSlideFactorConverter({
        eggsOnSlideInt: 10,
        templateFactorInt: 0,
      }).ok,
    ).toBe(false));
  it("rejects fractional slide counts", () =>
    expect(runKatokatzSlideFactorConverter({ eggsOnSlideInt: 1.5 }).ok).toBe(
      false,
    ));
});
