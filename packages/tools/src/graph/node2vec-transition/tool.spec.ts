import { describe, expect, it } from "vitest";
import {
  calculateNode2vecTransitions,
  node2vecTransitionExample,
  runNode2vecTransition,
} from "./tool.js";
describe("Node2vec Transition", () => {
  it("normalizes probabilities", () =>
    expect(
      calculateNode2vecTransitions(
        node2vecTransitionExample.input.candidates,
        1,
        2,
      ).reduce((sum, value) => sum + value.probability, 0),
    ).toBeCloseTo(1));
  it("publishes an executable example", () =>
    expect(runNode2vecTransition(node2vecTransitionExample.input)).toEqual({
      ok: true,
      output: node2vecTransitionExample.output,
    }));
});
