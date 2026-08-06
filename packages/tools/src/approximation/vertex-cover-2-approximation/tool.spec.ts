import { describe, expect, it } from "vitest";
import {
  approximateVertexCover,
  runVertexCoverApproximation,
  vertexCoverExample,
} from "./tool.js";
describe("Vertex-Cover 2-Approximation", () => {
  it("covers a cycle with a maximal matching", () =>
    expect(approximateVertexCover(vertexCoverExample.input.graph)).toEqual(
      vertexCoverExample.output.result,
    ));
  it("publishes an executable example", () =>
    expect(runVertexCoverApproximation(vertexCoverExample.input)).toEqual({
      ok: true,
      output: vertexCoverExample.output,
    }));
});
