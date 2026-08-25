import { describe, expect, it } from "vitest";
import {
  cellarStoragePlannerExample,
  cellarStoragePlannerTool,
  runCellarStoragePlanner,
} from "./tool.js";

describe("cellarStoragePlannerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCellarStoragePlanner(cellarStoragePlannerExample.input)).toEqual({
      ok: true,
      output: cellarStoragePlannerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(cellarStoragePlannerExample))).toEqual(cellarStoragePlannerExample);
    expect(cellarStoragePlannerTool.contractVersion).toBe(1);
    expect(cellarStoragePlannerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCellarStoragePlanner(null).ok).toBe(false);
    expect(
      runCellarStoragePlanner({ ...cellarStoragePlannerExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
