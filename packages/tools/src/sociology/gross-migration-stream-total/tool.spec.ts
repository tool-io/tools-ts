import { describe, expect, it } from "vitest";
import {
  calculateGrossMigrationStreams,
  grossMigrationStreamTotalExample,
  grossMigrationStreamTotalTool,
  runGrossMigrationStreamTotal,
} from "./tool.js";

describe("grossMigrationStreamTotalTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runGrossMigrationStreamTotal(grossMigrationStreamTotalExample.input),
    ).toEqual({
      ok: true,
      output: grossMigrationStreamTotalExample.output,
    });
  });

  it("excludes diagonal non-movers and requires a square flow matrix", () => {
    expect(
      calculateGrossMigrationStreams({
        streamsMatrix: [
          [1000, 20],
          [30, 2000],
        ],
      }),
    ).toEqual({ grossMigration: 50 });
    const result = runGrossMigrationStreamTotal({
      streamsMatrix: [
        [0, 1, 2],
        [3, 0, 4],
      ],
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].code).toBe("invalid_shape");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(grossMigrationStreamTotalExample)),
    ).toEqual(grossMigrationStreamTotalExample);
    expect(grossMigrationStreamTotalTool.contractVersion).toBe(1);
    expect(grossMigrationStreamTotalTool.execution).toEqual({ kind: "pure" });
  });

  it("rejects any negative cell wherever it appears, before summing", () => {
    // The matrix sums to a positive total; the negative cell alone must fail.
    expect(
      runGrossMigrationStreamTotal({
        streamsMatrix: [
          [500, -200],
          [100, 50],
        ],
      }).ok,
    ).toBe(false);
    expect(
      runGrossMigrationStreamTotal({
        streamsMatrix: [
          [0, 0],
          [0, -1],
        ],
      }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runGrossMigrationStreamTotal(null).ok).toBe(false);
    expect(
      runGrossMigrationStreamTotal({
        ...grossMigrationStreamTotalExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
