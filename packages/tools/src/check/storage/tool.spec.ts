import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateStorageCheck,
  storageCheckExample,
  storageCheckTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateStorageCheck>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Storage Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = storageCheckTool.execute(storageCheckExample.input);
    expect(result).toEqual({ ok: true, output: storageCheckExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(storageCheckTool.id).toBe("check/storage");
    expect(validateToolContract(storageCheckTool)).toEqual([]);
  });

  it("classifies headroom bands", () => {
    const low = calculateStorageCheck({
      quotaBytes: 100,
      usageBytes: 85,
    });
    expect(low.ok).toBe(true);
    if (low.ok) {
      expect(low.output.usedPercent).toBe(85);
      expect(low.output.headroomClass).toBe("low");
      expect(low.output.issues).toEqual(["low-space"]);
    }
    const critical = calculateStorageCheck({
      quotaBytes: 100,
      usageBytes: 99,
    });
    expect(critical.ok).toBe(true);
    if (critical.ok)
      expect(critical.output.headroomClass).toBe("critical");
  });

  it("reports unknown headroom when quota is missing or zero", () => {
    const missing = calculateStorageCheck({ usageBytes: 5 });
    expect(missing.ok).toBe(true);
    if (missing.ok) {
      expect(missing.output.headroomClass).toBe("unknown");
      expect(missing.output.issues).toEqual(["quota-unavailable"]);
      expect(missing.output.usedPercent).toBeNull();
    }
    const zero = calculateStorageCheck({ quotaBytes: 0 });
    expect(zero.ok).toBe(true);
    if (zero.ok) expect(zero.output.issues).toEqual(["quota-unavailable"]);
  });

  it("rejects contradictory or malformed probes", () => {
    expect(calculateStorageCheck(null).ok).toBe(false);
    expect(
      issueCodes(
        calculateStorageCheck({ quotaBytes: 10, usageBytes: 11 }),
      ),
    ).toEqual(["usage_exceeds_quota"]);
    expect(issueCodes(calculateStorageCheck({ quotaBytes: -1 }))).toEqual([
      "quota_bytes_invalid",
    ]);
    expect(issueCodes(calculateStorageCheck({ usageBytes: 1.5 }))).toEqual([
      "usage_bytes_invalid",
    ]);
    expect(issueCodes(calculateStorageCheck({ persisted: "yes" }))).toEqual([
      "persisted_invalid",
    ]);
    expect(issueCodes(calculateStorageCheck({ extra: 1 }))).toEqual([
      "unknown_field",
    ]);
  });
});
