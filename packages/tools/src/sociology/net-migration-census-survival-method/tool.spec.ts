import { describe, expect, it } from "vitest";
import {
  calculateNetMigrationCensusSurvival,
  netMigrationCensusSurvivalMethodExample,
  netMigrationCensusSurvivalMethodTool,
  runNetMigrationCensusSurvivalMethod,
} from "./tool.js";

describe("netMigrationCensusSurvivalMethodTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runNetMigrationCensusSurvivalMethod(
        netMigrationCensusSurvivalMethodExample.input,
      ),
    ).toEqual({
      ok: true,
      output: netMigrationCensusSurvivalMethodExample.output,
    });
  });

  it("subtracts projected survivors and preserves net-emigration signs", () => {
    expect(
      calculateNetMigrationCensusSurvival({
        populationEnd: 700,
        populationStart: 1000,
        survivalRatio: 0.8,
      }),
    ).toEqual({ netMigration: -100 });
    const result = runNetMigrationCensusSurvivalMethod({
      populationEnd: 700,
      populationStart: 1000,
      survivalRatio: -0.1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("survivalRatio");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(netMigrationCensusSurvivalMethodExample)),
    ).toEqual(netMigrationCensusSurvivalMethodExample);
    expect(netMigrationCensusSurvivalMethodTool.contractVersion).toBe(1);
    expect(netMigrationCensusSurvivalMethodTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runNetMigrationCensusSurvivalMethod(null).ok).toBe(false);
    expect(
      runNetMigrationCensusSurvivalMethod({
        ...netMigrationCensusSurvivalMethodExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
