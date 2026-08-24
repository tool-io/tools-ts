import { describe, expect, it } from "vitest";
import {
  calculatePlaybackObsolescenceTierLookup,
  playbackObsolescenceTierLookupExample,
  runPlaybackObsolescenceTierLookup,
} from "./tool.js";

describe("archival-studies/playback-obsolescence-tier-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPlaybackObsolescenceTierLookup(
        playbackObsolescenceTierLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: playbackObsolescenceTierLookupExample.output,
    });
  });

  it("assigns mid-table formats their documented tiers", () => {
    expect(calculatePlaybackObsolescenceTierLookup({ format: "vhs" })).toEqual({
      tierScore: 2,
      riskTier: "moderate",
    });
    expect(
      calculatePlaybackObsolescenceTierLookup({ format: "minidv-dvcam" }),
    ).toEqual({ tierScore: 3, riskTier: "elevated" });
  });

  it("rejects formats outside the table", () => {
    expect(
      runPlaybackObsolescenceTierLookup({
        format: "hddvd",
      }).ok,
    ).toBe(true);
    expect(
      runPlaybackObsolescenceTierLookup({
        format: "8-track",
      } as never).ok,
    ).toBe(false);
  });
});
