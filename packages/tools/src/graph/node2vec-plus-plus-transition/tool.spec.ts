import { describe, expect, it } from "vitest";
import {
  calculateNode2vecPlusPlusTransitions,
  node2vecPlusPlusExample,
  runNode2vecPlusPlus,
} from "./tool.js";
describe("Node2Vec++ Transition", () => {
  it("normalizes transition probabilities", () =>
    expect(
      calculateNode2vecPlusPlusTransitions(
        node2vecPlusPlusExample.input.candidates,
        1,
        2,
        1,
      ).reduce((sum, value) => sum + value.probability, 0),
    ).toBeCloseTo(1));
  it("publishes an executable example", () =>
    expect(runNode2vecPlusPlus(node2vecPlusPlusExample.input)).toEqual({
      ok: true,
      output: node2vecPlusPlusExample.output,
    }));
});
