import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculatePointerCheck,
  pointerCheckExample,
  pointerCheckTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculatePointerCheck>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Pointer Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = pointerCheckTool.execute(pointerCheckExample.input);
    expect(result).toEqual({ ok: true, output: pointerCheckExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(pointerCheckTool.id).toBe("check/pointer");
    expect(validateToolContract(pointerCheckTool)).toEqual([]);
  });

  it("snaps high-rate mice and labels irregular ones", () => {
    const gaming = calculatePointerCheck({
      moveTimestampsMs: [0, 1, 2, 3],
    });
    expect(gaming.ok).toBe(true);
    if (gaming.ok) {
      expect(gaming.output.pollingClass).toBe("1000");
      expect(gaming.output.verdict).toBe("working");
    }
    const irregular = calculatePointerCheck({
      moveTimestampsMs: [0, 9, 17],
    });
    expect(irregular.ok).toBe(true);
    if (irregular.ok) {
      expect(irregular.output.pollingClass).toBe("irregular");
      expect(irregular.output.verdict).toBe("irregular");
    }
  });

  it("reports no-data without samples", () => {
    const result = calculatePointerCheck({
      moveTimestampsMs: [],
      buttons: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("no-data");
      expect(result.output.issues).toEqual(["no-samples-captured"]);
      expect(result.output.pollingHertz).toBeNull();
      expect(result.output.buttonCount).toBe(0);
    }
  });

  it("counts set bits in the button mask", () => {
    const result = calculatePointerCheck({
      buttons: 0b101,
      moveTimestampsMs: [0, 8],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.buttonCount).toBe(2);
  });

  it("rejects malformed probes", () => {
    expect(calculatePointerCheck(null).ok).toBe(false);
    expect(issueCodes(calculatePointerCheck({}))).toEqual([
      "move_timestamps_required",
    ]);
    expect(
      issueCodes(calculatePointerCheck({ moveTimestampsMs: [5, 5] })),
    ).toEqual(["timestamp_order_invalid"]);
    expect(
      issueCodes(calculatePointerCheck({ buttons: -1, moveTimestampsMs: [] })),
    ).toEqual(["buttons_invalid"]);
    expect(
      issueCodes(
        calculatePointerCheck({ maxTouchPoints: 2.5, moveTimestampsMs: [] }),
      ),
    ).toEqual(["max_touch_points_invalid"]);
  });
});
