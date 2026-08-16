import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateKeyboardRollover,
  keyboardRolloverExample,
  keyboardRolloverTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateKeyboardRollover>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Keyboard Rollover Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = keyboardRolloverTool.execute(keyboardRolloverExample.input);
    expect(result).toEqual({ ok: true, output: keyboardRolloverExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(keyboardRolloverTool.id).toBe("check/keyboard-rollover");
    expect(validateToolContract(keyboardRolloverTool)).toEqual([]);
  });

  it("classifies n-key rollover past six keys", () => {
    const codes = "abcdefghijklmnopqrstuvwxyz".split("");
    const events = [
      ...codes.map((code) => ({ code, type: "press" as const })),
      ...codes.map((code) => ({ code, type: "release" as const })),
    ];
    const result = calculateKeyboardRollover({ events });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.maxConcurrentKeys).toBe(26);
      expect(result.output.rolloverClass).toBe("n-key");
    }
  });

  it("re-releases reduce concurrency and empty logs stay unknown", () => {
    const churn = calculateKeyboardRollover({
      events: [
        { code: "KeyA", type: "press" },
        { code: "KeyA", type: "release" },
        { code: "KeyB", type: "press" },
        { code: "KeyB", type: "release" },
      ],
    });
    expect(churn.ok).toBe(true);
    if (churn.ok) expect(churn.output.rolloverClass).toBe("1-key");
    expect(calculateKeyboardRollover({ events: [] })).toMatchObject({
      output: { maxConcurrentKeys: 0, rolloverClass: "unknown" },
    });
  });

  it("rejects malformed event logs", () => {
    expect(calculateKeyboardRollover(null).ok).toBe(false);
    expect(issueCodes(calculateKeyboardRollover({}))).toEqual([
      "events_required",
    ]);
    expect(
      issueCodes(
        calculateKeyboardRollover({
          events: [{ code: "KeyA", type: "hold" }, { code: "", type: "press" }],
        }),
      ),
    ).toEqual(["event_type_invalid", "event_code_invalid"]);
    expect(
      issueCodes(
        calculateKeyboardRollover({
          events: [{ code: "KeyA", extra: 1, type: "press" }],
        }),
      ),
    ).toEqual(["unknown_field"]);
  });
});
