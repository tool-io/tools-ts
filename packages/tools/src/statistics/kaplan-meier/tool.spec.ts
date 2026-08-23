import { describe, expect, it } from "vitest";
import {
  kaplanMeierExample,
  calculateKaplanMeier,
  runKaplanMeier,
} from "./tool.js";

describe("statistics/kaplan-meier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runKaplanMeier(kaplanMeierExample.input)).toEqual({
      ok: true,
      output: kaplanMeierExample.output,
    });
  });
  it("rejects invalid input (mismatched_lengths)", () => {
    expect(runKaplanMeier({ times: [1, 2], events: [1] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_time)", () => {
    expect(runKaplanMeier({ times: [-1], events: [1] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_event_indicator)", () => {
    expect(runKaplanMeier({ times: [4], events: [2] }).ok).toBe(false);
  });
  it("rejects invalid input (insufficient_data)", () => {
    expect(runKaplanMeier({ times: [], events: [] }).ok).toBe(false);
  });
  it("keeps survival at one when every subject is censored", () => {
    const result = runKaplanMeier({ times: [2, 4], events: [0, 0] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toEqual({
      finalSurvival: 1,
      stepCount: 0,
      survivalTable: [],
    });
  });
});
