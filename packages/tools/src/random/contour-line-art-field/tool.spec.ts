import { expect, it } from "vitest";
import tool, { example, calculateContourLineArtField } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateContourLineArtField);
it("lightweight flat field has no contours and duplicate levels fail", () => {
  const r = tool.execute({
    ...example.input,
    minimumHeight: 2,
    maximumHeight: 2,
    levels: [2],
  });
  if (!r.ok) throw new Error("Expected flat field");
  expect(r.output.paths).toEqual([]);
  expect(tool.execute({ ...example.input, levels: [0.5, 0.5] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "levels", code: "duplicate_entries" }] },
  });
});
