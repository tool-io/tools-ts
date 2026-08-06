import { describe, expect, it } from "vitest";
import {
  a3cRolloutExample,
  calculateA3cRolloutUpdate,
  runA3cRollout,
} from "./tool.js";
describe("A3C Rollout Update", () => {
  it("calculates reverse discounted returns", () =>
    expect(
      calculateA3cRolloutUpdate(
        [1, 0, 2],
        [0.5, 0.4, 0.8],
        [-0.2, -0.5, -0.1],
        [0.5, 0.6, 0.4],
        0,
        0.99,
        0.5,
        0.01,
      )?.returns,
    ).toEqual([2.9602, 1.98, 2]));
  it("publishes an executable example", () =>
    expect(runA3cRollout(a3cRolloutExample.input)).toEqual({
      ok: true,
      output: a3cRolloutExample.output,
    }));
});
