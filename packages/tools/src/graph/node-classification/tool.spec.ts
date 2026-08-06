import { describe, expect, it } from "vitest";
import {
  demonstrateNodeClassification,
  nodeClassificationExample,
  runNodeClassification,
} from "./tool.js";
describe("Node Classification", () => {
  it("selects the strongest class", () =>
    expect(
      demonstrateNodeClassification(
        nodeClassificationExample.input.ownScores,
        nodeClassificationExample.input.neighbors,
        1,
      ).predictedClass,
    ).toBe(1));
  it("publishes an executable example", () =>
    expect(runNodeClassification(nodeClassificationExample.input)).toEqual({
      ok: true,
      output: nodeClassificationExample.output,
    }));
});
