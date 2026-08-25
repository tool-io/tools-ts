import { describe, expect, it } from "vitest";
import {
  hazmatClassSegregationStorageCheckerExample,
  runHazmatClassSegregationStorageChecker,
} from "./tool.js";

describe("logistics/hazmat-class-segregation-storage-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHazmatClassSegregationStorageChecker(
        hazmatClassSegregationStorageCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: hazmatClassSegregationStorageCheckerExample.output,
    });
  });

  it("treats identical classes as same-class and clean pairs as unflagged", () => {
    const same = runHazmatClassSegregationStorageChecker({
      hazardClassA: "8",
      hazardClassB: "8",
    });
    const clean = runHazmatClassSegregationStorageChecker({
      hazardClassA: "6.1",
      hazardClassB: "9",
    });
    if (!same.ok || !clean.ok) throw new Error("expected success");
    expect(same.output.segregationLevel).toBe("same_class");
    expect(clean.output.segregationLevel).toBe("no_flagged_conflict");
  });

  it("rejects unknown class codes via schema validation", () => {
    expect(
      runHazmatClassSegregationStorageChecker({
        hazardClassA: "5.1",
        hazardClassB: "11" as never,
      }).ok,
    ).toBe(false);
  });
});
