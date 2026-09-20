import { expect, it } from "vitest";
import tool, { example, calculatePaperCutSilhouetteBrief } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculatePaperCutSilhouetteBrief);
it("lightweight independently constrained interior and wrapping", () => {
  const r = tool.execute({ ...example.input, wrapWidth: 12 });
  if (!r.ok) throw new Error("Expected brief");
  expect(r.output.briefs[0].wrappedText.split("\n").slice(0, 2)).toEqual([
    "Motif: leaf.",
    "Negative",
  ]);
  expect(tool.execute({ ...example.input, border: 4 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "border", code: "invalid_interior" }] },
  });
});
