import { describe, expect, it } from "vitest";
import {
  mpgLoadedVsEmptyAdjustedExample,
  runMpgLoadedVsEmptyAdjusted,
} from "./tool.js";

describe("mpg-loaded-vs-empty-adjusted", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMpgLoadedVsEmptyAdjusted(mpgLoadedVsEmptyAdjustedExample.input),
    ).toEqual({
      ok: true,
      output: mpgLoadedVsEmptyAdjustedExample.output,
    });
  });

  it("reports a zero penalty when economy is unchanged", () => {
    expect(
      runMpgLoadedVsEmptyAdjusted({ emptyMpg: 10, loadedMpg: 10 }),
    ).toEqual({ ok: true, output: { mpgLossPercent: 0, mpgPenalty: 0 } });
  });

  it("rejects zero empty MPG", () => {
    expect(runMpgLoadedVsEmptyAdjusted({ emptyMpg: 0, loadedMpg: 6 }).ok).toBe(
      false,
    );
  });
});
