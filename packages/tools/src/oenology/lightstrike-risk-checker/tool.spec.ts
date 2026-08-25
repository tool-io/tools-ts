import { describe, expect, it } from "vitest";
import {
  lightstrikeRiskCheckerExample,
  lightstrikeRiskCheckerTool,
  runLightstrikeRiskChecker,
} from "./tool.js";

describe("lightstrikeRiskCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runLightstrikeRiskChecker(lightstrikeRiskCheckerExample.input),
    ).toEqual({
      ok: true,
      output: lightstrikeRiskCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(lightstrikeRiskCheckerExample))).toEqual(
      lightstrikeRiskCheckerExample,
    );
    expect(lightstrikeRiskCheckerTool.contractVersion).toBe(1);
    expect(lightstrikeRiskCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runLightstrikeRiskChecker(null).ok).toBe(false);
    expect(
      runLightstrikeRiskChecker({
        ...lightstrikeRiskCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
