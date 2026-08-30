import { describe, expect, it } from "vitest";
import {
  accutronHistoryExample,
  lookupBulovaAccutronHistory,
  runAccutronHistory,
} from "./tool.js";

describe("Bulova Accutron tuning-fork history lookup", () => {
  it("reproduces the canonical 360 Hz oscillator fact", () => {
    expect(runAccutronHistory(accutronHistoryExample.input)).toEqual({
      ok: true,
      output: accutronHistoryExample.output,
    });
  });

  it("dates the launch to 1960", () => {
    expect(
      lookupBulovaAccutronHistory({ historyFocus: "launch" }).keyDate,
    ).toBe("1960");
  });

  it("keeps the published one-minute-per-month accuracy", () => {
    expect(
      lookupBulovaAccutronHistory({ historyFocus: "accuracy" })
        .verifiedStatement,
    ).toContain("one minute per month");
  });

  it("distinguishes electronic tuning-fork timing from quartz", () => {
    expect(
      lookupBulovaAccutronHistory({ historyFocus: "distinction" })
        .verifiedStatement,
    ).toContain("rather than a mechanical balance");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runAccutronHistory({ historyFocus: "kinetic" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "historyFocus" }] },
      ok: false,
    });
  });
});
