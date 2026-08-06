import { describe, expect, it } from "vitest";
import {
  demonstrateFeedforwardNetwork,
  feedforwardExample,
  runFeedforward,
} from "./tool.js";
describe("Feedforward Neural Network", () => {
  it("applies ReLU", () =>
    expect(
      demonstrateFeedforwardNetwork(
        [1, 2],
        [
          [0.5, 1],
          [-1, 0.25],
        ],
        [0.1, -0.2],
        "relu",
      )?.output,
    ).toEqual([2.6, 0]));
  it("publishes an executable example", () =>
    expect(runFeedforward(feedforwardExample.input)).toEqual({
      ok: true,
      output: feedforwardExample.output,
    }));
});
