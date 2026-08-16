import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateMicCheck,
  micCheckExample,
  micCheckTool,
} from "./tool.js";

const windows = (rms: number, peak: number, count: number) =>
  Array.from({ length: count }, () => ({ peak, rms }));

const issueCodes = (result: ReturnType<typeof calculateMicCheck>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Microphone Tester", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = micCheckTool.execute(micCheckExample.input);
    expect(result).toEqual({ ok: true, output: micCheckExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(micCheckTool.id).toBe("check/mic");
    expect(micCheckTool.execution).toEqual({ kind: "pure" });
    expect(validateToolContract(micCheckTool)).toEqual([]);
  });

  it("reports working audio with dBFS statistics", () => {
    const result = calculateMicCheck({
      levels: [...windows(0.3, 0.6, 3), ...windows(0.002, 0.004, 2)],
      permissionState: "granted",
      sampleRate: 44100,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("working");
      expect(result.output.issues).toEqual([]);
      // Sorted RMS [0.002, 0.002, 0.3, 0.3, 0.3] -> median 0.3
      expect(result.output.levelDbfs).toBeCloseTo(20 * Math.log10(0.3), 12);
      expect(result.output.noiseFloorDbfs).toBeCloseTo(
        20 * Math.log10(0.002),
        12,
      );
      expect(result.output.clippedWindows).toBe(0);
      expect(result.output.sampleRate).toBe(44100);
    }
  });

  it("flags clipping, silence, low level, and noisy floors in priority order", () => {
    const clipped = calculateMicCheck({
      levels: [{ peak: 1, rms: 0.9 }],
    });
    expect(clipped.ok).toBe(true);
    if (clipped.ok) expect(clipped.output.issues).toContain("clipping");

    const silent = calculateMicCheck({ levels: windows(0, 0, 4) });
    expect(silent.ok).toBe(true);
    if (silent.ok) {
      expect(silent.output.issues).toEqual(["silent"]);
      expect(silent.output.levelDbfs).toBeNull();
      expect(silent.output.verdict).toBe("degraded");
    }
    const quiet = calculateMicCheck({
      levels: windows(0.003, 0.006, 3),
    });
    expect(quiet.ok).toBe(true);
    if (quiet.ok) expect(quiet.output.issues).toContain("low-level");

    const noisy = calculateMicCheck({
      levels: [...windows(0.5, 0.7, 8), ...windows(0.03, 0.05, 2)],
    });
    expect(noisy.ok).toBe(true);
    if (noisy.ok) expect(noisy.output.issues).toContain("high-noise-floor");
  });

  it("cannot compute levels without windows", () => {
    const result = calculateMicCheck({ levels: [] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.windowCount).toBe(0);
      expect(result.output.levelDbfs).toBeNull();
      expect(result.output.peakDbfs).toBeNull();
      expect(result.output.verdict).toBe("degraded");
      expect(result.output.issues).toEqual(["no-samples-captured"]);
    }
  });

  it("blocks and reports not-found like its webcam sibling", () => {
    const denied = calculateMicCheck({
      levels: [],
      permissionState: "denied",
    });
    expect(denied.ok).toBe(true);
    if (denied.ok) expect(denied.output.verdict).toBe("blocked-by-permission");
    const unsupported = calculateMicCheck({
      levels: [],
      surfaceSupported: false,
      streamError: "NotAllowedError",
    });
    expect(unsupported.ok).toBe(true);
    if (unsupported.ok)
      expect(unsupported.output.verdict).toBe("unsupported-on-surface");
    const notFound = calculateMicCheck({
      levels: [],
      streamError: "NotFoundError",
    });
    expect(notFound.ok).toBe(true);
    if (notFound.ok) expect(notFound.output.verdict).toBe("not-found");
  });

  it("rejects malformed windows with precise field paths", () => {
    const result = calculateMicCheck({
      levels: [
        { peak: 0.5, rms: 0.25 },
        { peak: 2, rms: 0.25 },
        { peak: 0.5, rms: -1 },
        { peak: 0.1, rms: 0.5 },
        { peak: Number.NaN, rms: 0.5 },
        { capturedAt: 5, peak: 0.5, rms: 0.25 },
      ],
    });
    expect(result.ok).toBe(false);
    expect(issueCodes(result)).toEqual([
      "level_peak_invalid",
      "level_rms_invalid",
      "rms_exceeds_peak",
      "level_peak_invalid",
      "unknown_field",
    ]);
    if (!result.ok) expect(result.error.issues[0].field).toBe("levels.1.peak");
  });

  it("enforces resource limits and scalar validation", () => {
    const tooMany = calculateMicCheck({
      levels: Array.from({ length: 100_001 }, () => ({
        peak: 0.5,
        rms: 0.25,
      })),
    });
    expect(issueCodes(tooMany)).toEqual(["resource_limit_exceeded"]);
    expect(issueCodes(calculateMicCheck({ levels: [], sampleRate: 0 }))).toEqual([
      "sample_rate_invalid",
    ]);
    expect(
      issueCodes(calculateMicCheck({ levels: [], permissionState: "maybe" })),
    ).toEqual(["permission_state_invalid"]);
    expect(
      issueCodes(calculateMicCheck({ levels: [], surfaceSupported: 1 })),
    ).toEqual(["surface_supported_invalid"]);
    expect(issueCodes(calculateMicCheck({ extra: 1, levels: [] }))).toEqual([
      "unknown_field",
    ]);
    expect(calculateMicCheck(null).ok).toBe(false);
  });
});
