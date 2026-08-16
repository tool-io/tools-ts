import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  audioOutputCheckExample,
  audioOutputCheckTool,
  calculateAudioOutputCheck,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateAudioOutputCheck>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Audio Output Tester", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = audioOutputCheckTool.execute(audioOutputCheckExample.input);
    expect(result).toEqual({ ok: true, output: audioOutputCheckExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(audioOutputCheckTool.id).toBe("check/audio-output");
    expect(validateToolContract(audioOutputCheckTool)).toEqual([]);
  });

  it("names channel layouts", () => {
    for (const [count, layout] of [
      [1, "mono"],
      [2, "stereo"],
      [6, "surround-5-1"],
      [8, "surround-7-1"],
      [12, "multichannel"],
    ] as const) {
      const result = calculateAudioOutputCheck({ channelCount: count });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.output.channelLayout).toBe(layout);
        expect(result.output.verdict).toBe("working");
      }
    }
  });

  it("flags underruns, high latency, and unusual rates", () => {
    const result = calculateAudioOutputCheck({
      latencySamplesMs: [900, 950],
      sampleRate: 4000,
      underruns: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("degraded");
      expect(result.output.issues).toEqual([
        "audio-underruns",
        "high-latency",
        "unusual-sample-rate",
      ]);
      expect(result.output.medianLatencyMs).toBe(925);
    }
  });

  it("degrades without any probe data and on stream errors", () => {
    const empty = calculateAudioOutputCheck({});
    expect(empty.ok).toBe(true);
    if (empty.ok)
      expect(empty.output.issues).toEqual(["no-probe-data"]);
    const failed = calculateAudioOutputCheck({
      sampleRate: 48000,
      streamError: "NotSupportedError",
    });
    expect(failed.ok).toBe(true);
    if (failed.ok) expect(failed.output.issues).toContain("stream-error");
  });

  it("reports unsupported surfaces first", () => {
    const result = calculateAudioOutputCheck({
      surfaceSupported: false,
      underruns: 99,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("unsupported-on-surface");
      expect(result.output.issues).toEqual([]);
      expect(result.output.underruns).toBe(99);
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateAudioOutputCheck(null).ok).toBe(false);
    expect(
      issueCodes(calculateAudioOutputCheck({ extra: true })),
    ).toEqual(["unknown_field"]);
    expect(
      issueCodes(calculateAudioOutputCheck({ latencySamplesMs: [5, -1] })),
    ).toEqual(["latency_sample_invalid"]);
    expect(issueCodes(calculateAudioOutputCheck({ sampleRate: 0 }))).toEqual([
      "sample_rate_invalid",
    ]);
    expect(
      issueCodes(calculateAudioOutputCheck({ channelCount: -2 })),
    ).toEqual(["channel_count_invalid"]);
    expect(issueCodes(calculateAudioOutputCheck({ underruns: 1.5 }))).toEqual([
      "underruns_invalid",
    ]);
  });
});
