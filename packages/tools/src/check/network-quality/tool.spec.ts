import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateNetworkQuality,
  networkQualityExample,
  networkQualityTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateNetworkQuality>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Network Quality Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = networkQualityTool.execute(networkQualityExample.input);
    expect(result).toEqual({ ok: true, output: networkQualityExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(networkQualityTool.id).toBe("check/network-quality");
    expect(validateToolContract(networkQualityTool)).toEqual([]);
  });

  it("grades a stable fast connection as excellent", () => {
    const result = calculateNetworkQuality({
      latencyMs: [10, 11, 10, 12, 10],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.tier).toBe("excellent");
      expect(result.output.issues).toEqual([]);
      // Consecutive diffs 1, 1, 2, 2 -> mean absolute jitter 1.5
      expect(result.output.jitterMs).toBeCloseTo(1.5, 12);
    }
  });

  it("marks jittery connections unstable regardless of latency", () => {
    const result = calculateNetworkQuality({
      latencyMs: [5, 400, 5, 400, 5],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.tier).toBe("unstable");
      expect(result.output.issues).toContain("high-jitter");
    }
  });

  it("computes loss from attempts and flags packet loss", () => {
    const result = calculateNetworkQuality({
      attempts: 10,
      latencyMs: [50, 52, 51],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.lossPercent).toBeCloseTo(70, 12);
      expect(result.output.tier).toBe("unstable");
      expect(result.output.issues).toContain("packet-loss");
    }
  });

  it("flags slow throughput when measurements are supplied", () => {
    const result = calculateNetworkQuality({
      downloadBytesPerSecond: 500_000,
      latencyMs: [20, 21, 20],
      uploadBytesPerSecond: 100_000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.downloadMbps).toBeCloseTo(4, 12);
      expect(result.output.uploadMbps).toBeCloseTo(0.8, 12);
      expect(result.output.issues).toEqual([
        "slow-download",
        "slow-upload",
      ]);
      expect(result.output.tier).toBe("excellent");
    }
  });

  it("reports unknown tier without samples", () => {
    const result = calculateNetworkQuality({ latencyMs: [] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.tier).toBe("unknown");
      expect(result.output.issues).toEqual(["no-samples-captured"]);
      expect(result.output.medianLatencyMs).toBeNull();
      expect(result.output.jitterMs).toBeNull();
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateNetworkQuality(null).ok).toBe(false);
    expect(issueCodes(calculateNetworkQuality({}))).toEqual([
      "latency_ms_required",
    ]);
    expect(
      issueCodes(calculateNetworkQuality({ latencyMs: [10, 0, 20] })),
    ).toEqual(["latency_sample_invalid"]);
    expect(
      issueCodes(calculateNetworkQuality({ attempts: 2, latencyMs: [1, 2, 3] })),
    ).toEqual(["attempts_below_samples"]);
    expect(
      issueCodes(
        calculateNetworkQuality({
          downloadBytesPerSecond: -1,
          latencyMs: [5],
        }),
      ),
    ).toEqual(["download_bytes_invalid"]);
  });
});
