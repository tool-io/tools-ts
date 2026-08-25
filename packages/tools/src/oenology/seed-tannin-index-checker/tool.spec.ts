import { describe, expect, it } from "vitest";
import {
  seedTanninIndexExample,
  seedTanninIndexCheckerTool,
  runSeedTanninIndexChecker,
} from "./tool.js";

describe("seedTanninIndexCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runSeedTanninIndexChecker(seedTanninIndexExample.input)).toEqual({
      ok: true,
      output: seedTanninIndexExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(seedTanninIndexExample))).toEqual(
      seedTanninIndexExample,
    );
    expect(seedTanninIndexCheckerTool.contractVersion).toBe(1);
    expect(seedTanninIndexCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSeedTanninIndexChecker(null).ok).toBe(false);
    expect(
      runSeedTanninIndexChecker({
        ...seedTanninIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
