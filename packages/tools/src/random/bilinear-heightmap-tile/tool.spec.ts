import { expect, it } from "vitest";
import tool, {
  calculateBilinearHeightmapTile,
  bilinearHeightmapTileExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(tool, calculateBilinearHeightmapTile, example);
it("matches an independently weighted saddle sample and preserves raw edge heights", () => {
  const result = calculateBilinearHeightmapTile({
    ...example.input,
    rows: 5,
    columns: 5,
    sharedEdges: { bottom: [0, 8], top: [4, 0] },
  });
  if (!result.ok) throw new Error("expected saddle tile");
  // At (1/4,3/4), corner weights are 3/16,1/16,9/16,3/16.
  expect(result.output.values[3][1]).toBe(2.75);
  for (const row of result.output.values)
    for (const value of row) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(8);
    }
  const precise = calculateBilinearHeightmapTile({
    ...example.input,
    sharedEdges: { bottom: [0.123456789012345, 4], top: [8, 12] },
  });
  if (!precise.ok) throw new Error("expected precise corner");
  expect(precise.output.values[0][0]).toBe(0.123456789012345);
  expect(precise.output.coreValues[0][0]).toBe(0.123456789012);
});
it("supports matching linear edges between independently generated adjacent tiles", () => {
  const left = calculateBilinearHeightmapTile({
    ...example.input,
    rows: 9,
    columns: 9,
    sharedEdges: {},
    seed: 6,
  });
  if (!left.ok) throw new Error("expected first tile");
  const right = calculateBilinearHeightmapTile({
    ...example.input,
    rows: 9,
    columns: 9,
    sharedEdges: {
      left: [left.output.corners[0][1], left.output.corners[1][1]],
    },
    seed: 8,
  });
  if (!right.ok) throw new Error("expected adjacent tile");
  expect(left.output.values.map((row) => row.at(-1))).toEqual(
    right.output.values.map((row) => row[0]),
  );
});
it("validates edge feasibility, finite heights and bounded grids", () => {
  expect(
    tool.execute({
      ...example.input,
      sharedEdges: { bottom: [0, 4], left: [1, 8] },
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [
        { code: "inconsistent_shared_corner", field: "sharedEdges.left" },
      ],
    },
  });
  expect(
    tool.execute({ ...example.input, rows: 33, columns: 33 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "resource_limit", field: "rows" }] },
  });
  expect(
    tool.execute({ ...example.input, minimumHeight: 2, maximumHeight: 1 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_range", field: "maximumHeight" }] },
  });
  expect(
    tool.execute({ ...example.input, sharedEdges: { bottom: [Infinity, 1] } }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "sharedEdges" }] },
  });
  expect(
    tool.execute({ ...example.input, sharedEdges: { bottom: [1, 2, 3] } }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "sharedEdges" }] },
  });
});
