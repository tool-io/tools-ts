import { describe, expect, it } from "vitest";
import { ircCorrectedTimeExample, runIrcCorrectedTime } from "./tool.js";

describe("IRC Corrected Time Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runIrcCorrectedTime(ircCorrectedTimeExample.input)).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 3420 },
    });
  });

  it("leaves the elapsed time unchanged for a factor of one", () => {
    expect(
      runIrcCorrectedTime({ elapsedSeconds: 3600, timeCorrectionFactor: 1 }),
    ).toEqual({ ok: true, output: { correctedTimeSeconds: 3600 } });
  });

  it("accepts the inclusive lower bound of zero point eight", () => {
    expect(
      runIrcCorrectedTime({ elapsedSeconds: 3600, timeCorrectionFactor: 0.8 }),
    ).toEqual({ ok: true, output: { correctedTimeSeconds: 2880 } });
  });

  it("accepts the inclusive upper bound of one point three", () => {
    expect(
      runIrcCorrectedTime({ elapsedSeconds: 3600, timeCorrectionFactor: 1.3 }),
    ).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 4680 },
    });
  });

  it("ranks a slower rated boat ahead on equal elapsed time", () => {
    const slow = runIrcCorrectedTime({
      elapsedSeconds: 3600,
      timeCorrectionFactor: 0.9,
    });
    const fast = runIrcCorrectedTime({
      elapsedSeconds: 3600,
      timeCorrectionFactor: 1.1,
    });
    if (!slow.ok || !fast.ok) throw new Error("expected success");
    expect(slow.output.correctedTimeSeconds).toBeLessThan(
      Number(fast.output.correctedTimeSeconds),
    );
  });

  it("rejects a factor outside the schema bounds", () => {
    expect(
      runIrcCorrectedTime({ elapsedSeconds: 3600, timeCorrectionFactor: 0.79 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "timeCorrectionFactor" }],
      },
      ok: false,
    });
    expect(
      runIrcCorrectedTime({ elapsedSeconds: 3600, timeCorrectionFactor: 1.31 })
        .ok,
    ).toBe(false);
  });

  it("accepts zero and rejects negative elapsed time", () => {
    expect(
      runIrcCorrectedTime({ elapsedSeconds: 0, timeCorrectionFactor: 1 }),
    ).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 0 },
    });
    expect(
      runIrcCorrectedTime({ elapsedSeconds: -60, timeCorrectionFactor: 1 }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runIrcCorrectedTime({
        boatName: "Aria",
        elapsedSeconds: 3600,
        timeCorrectionFactor: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "boatName" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runIrcCorrectedTime(null).ok).toBe(false);
    expect(runIrcCorrectedTime({}).ok).toBe(false);
  });
});
