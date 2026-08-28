import { describe, expect, it } from "vitest";
import {
  calculatePllLockTimeEstimate,
  pllLockTimeEstimateExample,
  runPllLockTimeEstimate,
} from "./tool.js";

describe("PLL Lock Time", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPllLockTimeEstimate(pllLockTimeEstimateExample.input)).toEqual({
      ok: true,
      output: pllLockTimeEstimateExample.output,
    });
  });

  it("matches four radians of natural frequency", () => {
    expect(runPllLockTimeEstimate({ loopBandwidthHz: 100 })).toEqual({
      ok: true,
      output: { pllLockTimeSeconds: 0.006366197723675813 },
    });
  });

  it("halves lock time when bandwidth doubles", () => {
    const narrow = calculatePllLockTimeEstimate({
      loopBandwidthHz: 500,
    }).pllLockTimeSeconds;
    const wide = calculatePllLockTimeEstimate({
      loopBandwidthHz: 1000,
    }).pllLockTimeSeconds;
    expect(wide).toBe(narrow / 2);
  });

  it("yields sub-microsecond settling for a wide loop", () => {
    expect(
      calculatePllLockTimeEstimate({ loopBandwidthHz: 50000 })
        .pllLockTimeSeconds,
    ).toBe(0.000012732395447351628);
  });

  it("rejects zero bandwidth via invalid_bandwidth", () => {
    expect(runPllLockTimeEstimate({ loopBandwidthHz: 0 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_bandwidth", field: "loopBandwidthHz" }],
      },
      ok: false,
    });
  });

  it("rejects negative bandwidth via invalid_bandwidth", () => {
    expect(runPllLockTimeEstimate({ loopBandwidthHz: -100 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_bandwidth", field: "loopBandwidthHz" }],
      },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runPllLockTimeEstimate({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "loopBandwidthHz" }] },
      ok: false,
    });
  });
});
