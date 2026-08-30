import { describe, expect, it } from "vitest";
import {
  buildSystemsIcebergMap,
  runSystemsIceberg,
  systemsIcebergExample,
} from "./tool.js";

describe("systems iceberg events patterns structures models lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runSystemsIceberg(systemsIcebergExample.input)).toEqual({
      ok: true,
      output: systemsIcebergExample.output,
    });
  });

  it("assigns all four layers", () => {
    expect(
      buildSystemsIcebergMap({
        modelDescription: "M",
        observation: "E",
        patternDescription: "P",
        structureDescription: "S",
      }).layerAssignments,
    ).toEqual(["events: E", "patterns: P", "structures: S", "models: M"]);
  });

  it("provides one question per layer", () => {
    expect(
      buildSystemsIcebergMap({
        modelDescription: "M",
        observation: "E",
        patternDescription: "P",
        structureDescription: "S",
      }).layerQuestions,
    ).toHaveLength(4);
  });

  it("rejects an empty model description", () => {
    expect(
      runSystemsIceberg({
        modelDescription: " ",
        observation: "E",
        patternDescription: "P",
        structureDescription: "S",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "iceberg_layer_required", field: "modelDescription" }],
      },
      ok: false,
    });
  });
});
