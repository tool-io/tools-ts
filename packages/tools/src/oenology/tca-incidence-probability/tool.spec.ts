import { describe, expect, it } from "vitest";
import {
  tcaIncidenceProbabilityExample,
  tcaIncidenceProbabilityTool,
  runTcaIncidenceProbability,
} from "./tool.js";

describe("tcaIncidenceProbabilityTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runTcaIncidenceProbability(tcaIncidenceProbabilityExample.input),
    ).toEqual({
      ok: true,
      output: tcaIncidenceProbabilityExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(tcaIncidenceProbabilityExample))).toEqual(
      tcaIncidenceProbabilityExample,
    );
    expect(tcaIncidenceProbabilityTool.contractVersion).toBe(1);
    expect(tcaIncidenceProbabilityTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTcaIncidenceProbability(null).ok).toBe(false);
    expect(
      runTcaIncidenceProbability({
        ...tcaIncidenceProbabilityExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
