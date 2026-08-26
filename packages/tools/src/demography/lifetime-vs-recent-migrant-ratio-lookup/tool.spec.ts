import { describe, expect, it } from "vitest";
import {
  calculateLifetimeVsRecentMigrantRatioLookup,
  runLifetimeVsRecentMigrantRatioLookup,
  lifetimeVsRecentMigrantRatioLookupExample,
} from "./tool.js";

describe("demography/lifetime-vs-recent-migrant-ratio-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLifetimeVsRecentMigrantRatioLookup(
        lifetimeVsRecentMigrantRatioLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: lifetimeVsRecentMigrantRatioLookupExample.output,
    });
  });

  it("returns zero when no one was born outside", () => {
    expect(
      calculateLifetimeVsRecentMigrantRatioLookup({
        lifetimeMigrants: 0,
        recentMigrants: 800,
      }),
    ).toEqual({ ratio: 0 });
  });

  it("rejects a non-positive recent count", () => {
    expect(
      runLifetimeVsRecentMigrantRatioLookup({
        lifetimeMigrants: 10,
        recentMigrants: 0,
      }).ok,
    ).toBe(false);
  });
});
