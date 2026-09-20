import { expect, it } from "vitest";
import tool, { example, calculatePolygonBurstComposition } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculatePolygonBurstComposition);
it("lightweight exact quarter-turn and identity collision", () => {
  const r = tool.execute({ ...example.input, rotations: [0.25] });
  if (!r.ok) throw new Error("Expected polygon");
  expect(r.output.layers[0].points).toEqual([
    [1, 2],
    [1, 6],
    [-1, 2],
  ]);
  expect(
    tool.execute({
      ...example.input,
      motifs: [...example.input.motifs, ...example.input.motifs],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "motifs", code: "duplicate_entries" }] },
  });
});
