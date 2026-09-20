import { expect, it } from "vitest";
import tool, { example, calculateGiftWrapPatternPlacement } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateGiftWrapPatternPlacement);
it("lightweight merged exclusion bands and incompatible motif", () => {
  const r = tool.execute({
    ...example.input,
    foldLines: [2, 3],
    foldClearance: 1,
    motifs: [{ id: "dot", width: 1, height: 4 }],
  });
  if (!r.ok) throw new Error("Expected bands");
  expect(r.output.safeBands).toEqual([
    { x: 0, y: 0, width: 1, height: 4 },
    { x: 4, y: 0, width: 2, height: 4 },
  ]);
  expect(tool.execute({ ...example.input, foldClearance: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "motifs", code: "no_fit" }] },
  });
});
