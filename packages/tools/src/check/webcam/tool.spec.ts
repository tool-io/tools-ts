import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateWebcamCheck,
  isWebcamCheckOutput,
  webcamCheckExample,
  webcamCheckInputSchema,
  webcamCheckOutputSchema,
  webcamCheckTool,
} from "./tool.js";

const framesAt = (
  intervalMs: number,
  count: number,
  width = 1280,
  height = 720,
) =>
  Array.from({ length: count }, (_, index) => ({
    capturedAt: index * intervalMs,
    height,
    width,
  }));

const issueCodes = (result: ReturnType<typeof calculateWebcamCheck>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Webcam Tester", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = webcamCheckTool.execute(webcamCheckExample.input);
    expect(result).toEqual({ ok: true, output: webcamCheckExample.output });
  });

  it("keeps the canonical example JSON round trip stable", () => {
    const restored = JSON.parse(JSON.stringify(webcamCheckExample)) as unknown;
    expect(restored).toEqual(webcamCheckExample);
  });

  it("publishes a valid pure tool contract", () => {
    expect(webcamCheckTool.id).toBe("check/webcam");
    expect(webcamCheckTool.execution).toEqual({ kind: "pure" });
    const definition = webcamCheckTool as unknown;
    expect(validateToolContract(definition)).toEqual([]);
    expect(webcamCheckInputSchema.required).toContain("frames");
    expect(webcamCheckOutputSchema.properties.verdict.type).toBe("string");
  });

  it("reports a working camera with median-based fps", () => {
    const result = calculateWebcamCheck({
      deviceCount: 2,
      frames: framesAt(33, 5),
      permissionState: "granted",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("working");
      expect(result.output.issues).toEqual([]);
      // Uniform 33 ms gaps -> median 33 -> 1000 / 33
      expect(result.output.estimatedFps).toBeCloseTo(30.303030303030305, 10);
      expect(result.output.resolutionClass).toBe("hd");
    }
  });

  it("averages the two middle deltas for an even number of gaps", () => {
    const result = calculateWebcamCheck({ frames: framesAt(40, 3) });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.estimatedFps).toBe(25);
    const uneven = calculateWebcamCheck({
      frames: [
        { capturedAt: 0, height: 720, width: 1280 },
        { capturedAt: 30, height: 720, width: 1280 },
        { capturedAt: 70, height: 720, width: 1280 },
        { capturedAt: 100, height: 720, width: 1280 },
        { capturedAt: 140, height: 720, width: 1280 },
      ],
    });
    expect(uneven.ok).toBe(true);
    if (uneven.ok) expect(uneven.output.estimatedFps).toBeCloseTo(28.571428571428573, 10);
  });

  it("cannot estimate fps from fewer than two frames", () => {
    const single = calculateWebcamCheck({
      frames: [{ capturedAt: 0, height: 1080, width: 1920 }],
    });
    expect(single.ok).toBe(true);
    if (single.ok) {
      expect(single.output.verdict).toBe("working");
      expect(single.output.estimatedFps).toBeNull();
      expect(single.output.frameCount).toBe(1);
      expect(isWebcamCheckOutput(single.output)).toBe(true);
    }
  });

  it("degrades with no-frames-captured when capture produced nothing", () => {
    const result = calculateWebcamCheck({
      deviceCount: 1,
      frames: [],
      permissionState: "granted",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("degraded");
      expect(result.output.issues).toEqual(["no-frames-captured"]);
      expect(result.output.estimatedFps).toBeNull();
      expect(result.output.width).toBeNull();
      expect(result.output.resolutionClass).toBeNull();
    }
  });

  it("reports low frame rate and low resolution in priority order", () => {
    const result = calculateWebcamCheck({
      frames: framesAt(120, 4, 320, 240),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("degraded");
      expect(result.output.issues).toEqual([
        "low-frame-rate",
        "low-resolution",
      ]);
      expect(result.output.resolutionClass).toBe("low");
    }
  });

  it("classifies resolution classes by the shorter side", () => {
    const portrait = calculateWebcamCheck({
      frames: [
        { capturedAt: 0, height: 2560, width: 1440 },
        { capturedAt: 20, height: 2560, width: 1440 },
        { capturedAt: 40, height: 2560, width: 1440 },
      ],
    });
    expect(portrait.ok).toBe(true);
    if (portrait.ok) expect(portrait.output.resolutionClass).toBe("quad-hd");
  });

  it("blocks on denied permission without requiring frames", () => {
    const result = calculateWebcamCheck({
      frames: [],
      permissionState: "denied",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.verdict).toBe("blocked-by-permission");
  });

  it("blocks on NotAllowedError stream failures", () => {
    const result = calculateWebcamCheck({
      frames: [],
      streamError: "NotAllowedError",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.verdict).toBe("blocked-by-permission");
  });

  it("reports not-found for zero devices or NotFoundError", () => {
    const noDevices = calculateWebcamCheck({
      deviceCount: 0,
      frames: [],
    });
    expect(noDevices.ok).toBe(true);
    if (noDevices.ok) expect(noDevices.output.verdict).toBe("not-found");
    const notFound = calculateWebcamCheck({
      frames: [],
      streamError: "NotFoundError",
    });
    expect(notFound.ok).toBe(true);
    if (notFound.ok) expect(notFound.output.verdict).toBe("not-found");
  });

  it("gives unsupported surfaces the highest verdict precedence", () => {
    const result = calculateWebcamCheck({
      frames: [],
      permissionState: "denied",
      surfaceSupported: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.verdict).toBe("unsupported-on-surface");
  });

  it("treats other stream errors as degradation signals", () => {
    const result = calculateWebcamCheck({
      deviceCount: 1,
      frames: [],
      streamError: "NotReadableError",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("degraded");
      expect(result.output.issues).toEqual([
        "stream-error",
        "no-frames-captured",
      ]);
    }
  });

  it("breaks dominant-resolution ties toward the earliest size", () => {
    const result = calculateWebcamCheck({
      frames: [
        { capturedAt: 0, height: 480, width: 640 },
        { capturedAt: 30, height: 600, width: 800 },
        { capturedAt: 60, height: 480, width: 640 },
        { capturedAt: 90, height: 600, width: 800 },
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.width).toBe(640);
      expect(result.output.height).toBe(480);
    }
  });

  it("rejects non-object inputs and missing frames", () => {
    expect(calculateWebcamCheck(null).ok).toBe(false);
    expect(calculateWebcamCheck("probe").ok).toBe(false);
    expect(issueCodes(calculateWebcamCheck({}))).toEqual(["frames_required"]);
    expect(issueCodes(calculateWebcamCheck({ frames: "nope" }))).toEqual([
      "frames_invalid",
    ]);
  });

  it("rejects malformed frames with precise field paths", () => {
    const result = calculateWebcamCheck({
      frames: [
        { capturedAt: 0, height: 720, width: 1280 },
        { capturedAt: 10, height: 0, width: 1280, label: "extra" },
        { capturedAt: -5, height: 720, width: 0 },
        { capturedAt: 1.5, height: 720, width: 1280 },
      ],
    });
    expect(result.ok).toBe(false);
    expect(issueCodes(result)).toEqual([
      "unknown_field",
      "frame_height_invalid",
      "frame_width_invalid",
      "frame_timestamp_invalid",
      "frame_timestamp_invalid",
    ]);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("frames.1.label");
  });

  it("rejects non-finite and out-of-order timestamps", () => {
    expect(
      issueCodes(
        calculateWebcamCheck({
          frames: [
            { capturedAt: Number.POSITIVE_INFINITY, height: 720, width: 1280 },
          ],
        }),
      ),
    ).toEqual(["frame_timestamp_invalid"]);
    expect(
      issueCodes(
        calculateWebcamCheck({
          frames: [
            { capturedAt: 100, height: 720, width: 1280 },
            { capturedAt: 50, height: 720, width: 1280 },
          ],
        }),
      ),
    ).toEqual(["frame_order_invalid"]);
    expect(
      issueCodes(
        calculateWebcamCheck({
          frames: [
            { capturedAt: 50, height: 720, width: 1280 },
            { capturedAt: 50, height: 720, width: 1280 },
          ],
        }),
      ),
    ).toEqual(["frame_order_invalid"]);
  });

  it("enforces resource limits and scalar field validation", () => {
    const tooMany = calculateWebcamCheck({
      frames: Array.from({ length: 100_001 }, (_, index) => ({
        capturedAt: index,
        height: 720,
        width: 1280,
      })),
    });
    expect(issueCodes(tooMany)).toEqual(["resource_limit_exceeded"]);
    if (!tooMany.ok)
      expect(tooMany.error.issues[0].field).toBe("frames");

    expect(
      issueCodes(calculateWebcamCheck({ frames: [], permissionState: "maybe" })),
    ).toEqual(["permission_state_invalid"]);
    expect(
      issueCodes(calculateWebcamCheck({ deviceCount: -1, frames: [] })),
    ).toEqual(["device_count_invalid"]);
    expect(
      issueCodes(calculateWebcamCheck({ frames: [], streamError: 42 })),
    ).toEqual(["stream_error_invalid"]);
    expect(
      issueCodes(calculateWebcamCheck({ frames: [], surfaceSupported: "yes" })),
    ).toEqual(["surface_supported_invalid"]);
    expect(issueCodes(calculateWebcamCheck({ extra: true, frames: [] }))).toEqual([
      "unknown_field",
    ]);
  });
});
