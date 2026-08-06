import { describe, expect, it } from "vitest";
import {
  birchMicroclustersExample,
  createBirchMicroclusters,
  runBirchMicroclusters,
} from "./tool.js";
describe("BIRCH Microclusters", () => {
  it("separates distant point groups", () =>
    expect(
      createBirchMicroclusters(birchMicroclustersExample.input.points, 0.5),
    ).toHaveLength(2));
  it("publishes an executable example", () =>
    expect(runBirchMicroclusters(birchMicroclustersExample.input)).toEqual({
      ok: true,
      output: birchMicroclustersExample.output,
    }));
});
