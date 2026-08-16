import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateDisplayCheck,
  displayCheckExample,
  displayCheckTool,
} from "./tool.js";

const burst = (intervalMs: number, count: number) =>
  Array.from({ length: count }, (_, index) => index * intervalMs);

const issueCodes = (result: ReturnType<typeof calculateDisplayCheck>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Display Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = displayCheckTool.execute(displayCheckExample.input);
    expect(result).toEqual({ ok: true, output: displayCheckExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(displayCheckTool.id).toBe("check/display");
    expect(validateToolContract(displayCheckTool)).toEqual([]);
  });

  it("snaps fractional rAF deltas to common refresh rates", () => {
    const result = calculateDisplayCheck({
      frameTimestampsMs: [0, 8.333333333333334, 16.666666666666668],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.refreshHertz).toBeCloseTo(120, 9);
      expect(result.output.refreshClass).toBe("120");
    }
  });

  it("labels irregular rates and flags low refresh", () => {
    const irregular = calculateDisplayCheck({
      frameTimestampsMs: burst(31.7, 4),
    });
    expect(irregular.ok).toBe(true);
    if (irregular.ok) expect(irregular.output.refreshClass).toBe("irregular");
    const slow = calculateDisplayCheck({ frameTimestampsMs: burst(40, 3) });
    expect(slow.ok).toBe(true);
    if (slow.ok) {
      // 25 Hz misses every candidate's ±2% snap window.
      expect(slow.output.issues).toContain("low-refresh");
      expect(slow.output.refreshClass).toBe("irregular");
    }
  });

  it("cannot measure refresh below two timestamps", () => {
    const result = calculateDisplayCheck({
      frameTimestampsMs: [42],
      height: 720,
      width: 1280,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.refreshHertz).toBeNull();
      expect(result.output.refreshClass).toBeNull();
      expect(result.output.resolutionClass).toBe("hd");
      expect(result.output.issues).toEqual([]);
    }
  });

  it("estimates physical pixels from the pixel ratio", () => {
    const result = calculateDisplayCheck({
      devicePixelRatio: 1.5,
      frameTimestampsMs: burst(20, 2),
      height: 800,
      width: 1280,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.physicalWidthEstimate).toBe(1920);
      expect(result.output.physicalHeightEstimate).toBe(1200);
    }
  });

  it("requires width and height together and rejects bad probes", () => {
    expect(calculateDisplayCheck(null).ok).toBe(false);
    expect(
      issueCodes(calculateDisplayCheck({ frameTimestampsMs: [], width: 100 })),
    ).toEqual(["resolution_partial"]);
    expect(
      issueCodes(
        calculateDisplayCheck({
          frameTimestampsMs: [10, 5],
        }),
      ),
    ).toEqual(["timestamp_order_invalid"]);
    expect(
      issueCodes(
        calculateDisplayCheck({
          devicePixelRatio: 0,
          frameTimestampsMs: [0],
        }),
      ),
    ).toEqual(["device_pixel_ratio_invalid"]);
    expect(issueCodes(calculateDisplayCheck({ extra: 1, frameTimestampsMs: [] }))).toEqual([
      "unknown_field",
    ]);
    expect(issueCodes(calculateDisplayCheck({ frameTimestampsMs: [-1] }))).toEqual([
      "timestamp_invalid",
    ]);
  });
});
