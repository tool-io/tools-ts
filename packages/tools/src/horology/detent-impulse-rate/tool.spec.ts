import { describe, expect, it } from "vitest";
import {
  calculateDetentImpulseRate,
  detentImpulseExample,
  runDetentImpulse,
} from "./tool.js";

describe("detent escapement alternating-impulse calculator", () => {
  it("reproduces the canonical 18,000-bph example", () => {
    expect(runDetentImpulse(detentImpulseExample.input)).toEqual({
      ok: true,
      output: detentImpulseExample.output,
    });
  });

  it("independently halves 21,600 beats per hour", () => {
    expect(
      calculateDetentImpulseRate({ balanceBeatsPerHour: 21_600 })
        .impulsesPerHour,
    ).toBe(10_800);
  });

  it("accepts the lower positive even boundary", () => {
    expect(
      calculateDetentImpulseRate({ balanceBeatsPerHour: 2 }),
    ).toMatchObject({ impulsesPerHour: 1 });
  });

  it("rejects an odd beat rate", () => {
    expect(runDetentImpulse({ balanceBeatsPerHour: 18_001 })).toMatchObject({
      error: {
        issues: [
          {
            code: "balance_beat_rate_invalid",
            field: "balanceBeatsPerHour",
          },
        ],
      },
      ok: false,
    });
  });
});
