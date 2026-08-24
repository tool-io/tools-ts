import { describe, expect, it } from "vitest";
import { punchThroughCurrentExample, runPunchThroughCurrent } from "./tool.js";

describe("Punch-Through Current Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runPunchThroughCurrent(punchThroughCurrentExample.input)).toEqual({
      ok: true,
      output: punchThroughCurrentExample.output,
    }));

  it("applies the supplied characteristic length", () => {
    const result = runPunchThroughCurrent({
      channelLengthNm: 5,
      characteristicLengthNm: 10,
      prethresholdCurrentNanoA: 100,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.punchThroughNanoA).toBeCloseTo(
      100 * Math.exp(-0.5),
      12,
    );
  });

  it("decays with channel length", () => {
    const short = runPunchThroughCurrent({
      channelLengthNm: 5,
      characteristicLengthNm: 10,
      prethresholdCurrentNanoA: 100,
    });
    const long = runPunchThroughCurrent({
      channelLengthNm: 50,
      characteristicLengthNm: 10,
      prethresholdCurrentNanoA: 100,
    });
    expect(short.ok).toBe(true);
    expect(long.ok).toBe(true);
    if (!short.ok || !long.ok) return;
    const shortValue = short.output.punchThroughNanoA as number;
    const longValue = long.output.punchThroughNanoA as number;
    expect(longValue).toBeLessThan(shortValue);
    expect(longValue).toBeCloseTo(0.6737946999085467, 15);
  });

  it("honors an explicit characteristic length", () => {
    const result = runPunchThroughCurrent({
      characteristicLengthNm: 8,
      channelLengthNm: 16,
      prethresholdCurrentNanoA: 40,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.punchThroughNanoA).toBeCloseTo(40 * Math.exp(-2), 12);
  });

  it("returns the prethreshold current when length vanishes relative to lambda", () => {
    const result = runPunchThroughCurrent({
      channelLengthNm: 1e-300,
      characteristicLengthNm: 10,
      prethresholdCurrentNanoA: 100,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.punchThroughNanoA).toBeCloseTo(100, 12);
  });

  it("yields zero punch-through for zero prethreshold current", () =>
    expect(
      runPunchThroughCurrent({
        channelLengthNm: 5,
        characteristicLengthNm: 10,
        prethresholdCurrentNanoA: 0,
      }),
    ).toEqual({ ok: true, output: { punchThroughNanoA: 0 } }));

  it("rejects zero channel length", () =>
    expect(
      runPunchThroughCurrent({
        channelLengthNm: 0,
        prethresholdCurrentNanoA: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects a negative characteristic length", () =>
    expect(
      runPunchThroughCurrent({
        characteristicLengthNm: -10,
        channelLengthNm: 5,
        prethresholdCurrentNanoA: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects a negative prethreshold current", () =>
    expect(
      runPunchThroughCurrent({
        channelLengthNm: 5,
        characteristicLengthNm: 10,
        prethresholdCurrentNanoA: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "prethresholdCurrentNanoA" }],
      },
      ok: false,
    }));

  it("rejects a non-finite channel length", () =>
    expect(
      runPunchThroughCurrent({
        channelLengthNm: Number.POSITIVE_INFINITY,
        characteristicLengthNm: 10,
        prethresholdCurrentNanoA: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "channelLengthNm" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(
      runPunchThroughCurrent({
        channelLengthNm: 5,
        characteristicLengthNm: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "prethresholdCurrentNanoA" }],
      },
      ok: false,
    }));

  it("requires an explicitly calibrated characteristic length", () =>
    expect(
      runPunchThroughCurrent({
        channelLengthNm: 5,
        prethresholdCurrentNanoA: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ field: "characteristicLengthNm" }] },
      ok: false,
    }));
});
