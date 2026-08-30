import { describe, expect, it } from "vitest";
import {
  calculateEscapementImpulseRate,
  escapementImpulseRateExample,
  runEscapementImpulseRate,
} from "./tool.js";

describe("detent, duplex, and natural impulse-rate calculator", () => {
  it("reproduces the canonical detent example", () => {
    expect(
      runEscapementImpulseRate(escapementImpulseRateExample.input),
    ).toEqual({ ok: true, output: escapementImpulseRateExample.output });
  });

  it("gives the duplex one impulse per two beats", () => {
    expect(
      calculateEscapementImpulseRate({
        balanceBeatsPerHour: 21_600,
        escapement: "duplex",
      }),
    ).toMatchObject({ beatsPerImpulse: 2, impulsesPerHour: 10_800 });
  });

  it("gives the natural escapement one impulse per beat", () => {
    expect(
      calculateEscapementImpulseRate({
        balanceBeatsPerHour: 21_600,
        escapement: "natural",
      }),
    ).toMatchObject({ beatsPerImpulse: 1, impulsesPerHour: 21_600 });
  });

  it("rejects a zero beat rate", () => {
    expect(
      runEscapementImpulseRate({
        balanceBeatsPerHour: 0,
        escapement: "detent",
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "balanceBeatsPerHour",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects an unsupported escapement at the public boundary", () => {
    expect(
      runEscapementImpulseRate({
        balanceBeatsPerHour: 18_000,
        escapement: "lever",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "escapement" }] },
      ok: false,
    });
  });
});
