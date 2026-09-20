import { describe, expect, it } from "vitest";
import { createGeneratorRandom } from "./generator-random.js";
import {
  canonicalEdges,
  connectedSimpleEdges,
  extendSimpleEdges,
  graphAdjacency,
  verifiedComponentCount,
} from "./graph-instance-construction.js";

describe("bounded graph construction", () => {
  it("builds the hand-replayed recursive tree under an all-zero source", () => {
    const random = createGeneratorRandom(undefined, { random: () => 0 });
    expect(connectedSimpleEdges(3, 2, random)).toEqual([
      [0, 1],
      [1, 2],
    ]);
    expect(
      verifiedComponentCount(3, [
        [0, 1],
        [1, 2],
      ]),
    ).toBe(1);
    expect(verifiedComponentCount(3, [[0, 1]])).toBe(2);
  });
  it("fills complete graphs without retries or duplicate edges", () => {
    expect(connectedSimpleEdges(3, 3, createGeneratorRandom(42))).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
    expect(
      graphAdjacency(3, [
        [0, 1],
        [1, 2],
      ]),
    ).toEqual({ "0": ["1"], "1": ["0", "2"], "2": ["1"] });
  });
  it("preserves mandatory pairs and canonicalizes without mutating source", () => {
    const input: [number, number][] = [
      [2, 1],
      [2, 0],
    ];
    expect(canonicalEdges(input)).toEqual([
      [0, 2],
      [1, 2],
    ]);
    expect(input).toEqual([
      [2, 1],
      [2, 0],
    ]);
    const result = extendSimpleEdges(3, 3, input, createGeneratorRandom(7));
    expect(result).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
  });
  it("distinguishes impossible user counts from repeated mandatory-edge programming errors", () => {
    for (const count of [0, 1, 4])
      expect(() =>
        connectedSimpleEdges(3, count, createGeneratorRandom(42)),
      ).toThrowError(
        expect.objectContaining({
          code: "infeasible_edge_count",
          field: "edgeCount",
        }),
      );
    expect(() =>
      extendSimpleEdges(
        3,
        1,
        [
          [0, 1],
          [1, 2],
        ],
        createGeneratorRandom(42),
      ),
    ).toThrowError(
      expect.objectContaining({
        code: "infeasible_edge_count",
        field: "edgeCount",
      }),
    );
    expect(() =>
      extendSimpleEdges(
        3,
        2,
        [
          [0, 1],
          [1, 0],
        ],
        createGeneratorRandom(42),
      ),
    ).toThrow("repeated mandatory edges");
  });
});
