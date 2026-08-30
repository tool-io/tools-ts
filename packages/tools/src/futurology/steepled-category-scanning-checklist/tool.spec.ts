import { describe, expect, it } from "vitest";
import {
  checkSteepledScanning,
  runSteepledScanning,
  steepledScanningExample,
} from "./tool.js";

describe("STEEPLED category scanning checklist", () => {
  it("reproduces its canonical example", () => {
    expect(runSteepledScanning(steepledScanningExample.input)).toEqual({
      ok: true,
      output: steepledScanningExample.output,
    });
  });

  it("is complete when all eight categories are covered", () => {
    expect(
      checkSteepledScanning({
        demographic: true,
        economic: true,
        environmental: true,
        ethical: true,
        legal: true,
        political: true,
        social: true,
        technological: true,
      }),
    ).toMatchObject({ complete: true, coveredCategoryCount: 8 });
  });

  it("lists missing categories in acronym order", () => {
    expect(
      checkSteepledScanning({
        demographic: false,
        economic: true,
        environmental: true,
        ethical: true,
        legal: false,
        political: true,
        social: false,
        technological: true,
      }).missingCategories,
    ).toEqual(["social", "legal", "demographic"]);
  });
});
