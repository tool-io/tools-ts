import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateClockOffset,
  clockOffsetExample,
  clockOffsetTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateClockOffset>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

const pair = (deviceTimeMs: number, referenceTimeMs: number) => ({
  deviceTimeMs,
  referenceTimeMs,
});

describe("Clock Offset Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = clockOffsetTool.execute(clockOffsetExample.input);
    expect(result).toEqual({ ok: true, output: clockOffsetExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(clockOffsetTool.id).toBe("check/clock-offset");
    expect(validateToolContract(clockOffsetTool)).toEqual([]);
  });

  it("classifies minor and major skew with issue codes", () => {
    const minor = calculateClockOffset({
      samples: [pair(0, 0), pair(30_000, 0)],
    });
    expect(minor.ok).toBe(true);
    if (minor.ok) {
      expect(minor.output.skew).toBe("minor-skew");
      expect(minor.output.issues).toEqual(["clock-drift"]);
      expect(minor.output.offsetMs).toBe(15_000);
    }
    const major = calculateClockOffset({
      samples: [pair(120_000, 0)],
    });
    expect(major.ok).toBe(true);
    if (major.ok) {
      expect(major.output.skew).toBe("major-skew");
      expect(major.output.issues).toEqual(["clock-skewed"]);
      expect(major.output.spreadMs).toBeNull();
    }
  });

  it("requires at least one sample and rejects bad pairs", () => {
    const empty = calculateClockOffset({ samples: [] });
    expect(empty.ok).toBe(true);
    if (empty.ok) {
      expect(empty.output.skew).toBe("synced");
      expect(empty.output.offsetMs).toBeNull();
      expect(empty.output.sampleCount).toBe(0);
    }
    expect(issueCodes(calculateClockOffset({}))).toEqual([
      "samples_required",
    ]);
    expect(
      issueCodes(
        calculateClockOffset({
          samples: [pair(-1, 0), pair(1.5, 0), pair(0, 0, )],
        }),
      ),
    ).toEqual([
      "deviceTimeMs_invalid",
      "deviceTimeMs_invalid",
    ]);
    expect(
      issueCodes(
        calculateClockOffset({ samples: [{ deviceTimeMs: 1 }], extra: 2 }),
      ),
    ).toEqual(["unknown_field", "referenceTimeMs_invalid"]);
  });
});
