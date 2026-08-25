import { describe, expect, it } from "vitest";
import {
  cardinalTempsRecorderExample,
  cardinalTempsRecorderTool,
  runCardinalTempsRecorder,
} from "./tool.js";

describe("Cardinal Temps Recorder", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runCardinalTempsRecorder(cardinalTempsRecorderExample.input),
    ).toEqual({
      ok: true,
      output: cardinalTempsRecorderExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(cardinalTempsRecorderExample))).toEqual(
      cardinalTempsRecorderExample,
    );
    expect(cardinalTempsRecorderTool.contractVersion).toBe(1);
    expect(cardinalTempsRecorderTool.execution).toEqual({ kind: "pure" });
  });

  it("echoes each recorded cardinal into its growth output", () => {
    const result = runCardinalTempsRecorder({
      minimumC: -5,
      optimumC: 40,
      maximumC: 65,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output).toEqual({
        minGrowthC: -5,
        optimumGrowthC: 40,
        maxGrowthC: 65,
      });
  });

  it("accepts equal cardinals at the range boundaries", () => {
    expect(
      runCardinalTempsRecorder({ minimumC: -10, optimumC: -10, maximumC: 90 })
        .ok,
    ).toBe(true);
    expect(
      runCardinalTempsRecorder({ minimumC: 90, optimumC: 90, maximumC: 90 }).ok,
    ).toBe(true);
  });

  it("guards an incoherent cardinal ordering", () => {
    const result = runCardinalTempsRecorder({
      minimumC: 30,
      optimumC: 10,
      maximumC: 55,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_cardinal_order");
    expect(
      runCardinalTempsRecorder({ minimumC: 5, optimumC: 30, maximumC: 20 }).ok,
    ).toBe(false);
  });

  it("does not impose arbitrary minus-ten or ninety-degree limits", () => {
    expect(
      runCardinalTempsRecorder({
        maximumC: 55,
        minimumC: -11,
        optimumC: 30,
      }).ok,
    ).toBe(true);
    expect(
      runCardinalTempsRecorder({
        maximumC: 95,
        minimumC: 5,
        optimumC: 91,
      }).ok,
    ).toBe(true);
  });

  it("returns structured errors for malformed input", () => {
    expect(runCardinalTempsRecorder(null).ok).toBe(false);
    expect(
      runCardinalTempsRecorder({
        ...cardinalTempsRecorderExample.input,
        extra: 1,
      }).ok,
    ).toBe(false);
  });
});
