import { expect, it } from "vitest";
import tool, { example, calculatePaperFanPanelPattern } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculatePaperFanPanelPattern);
it("lightweight connector chain and unsatisfied outer edge", () => {
  const r = tool.execute({
    ...example.input,
    motifs: [
      { id: "start", width: 1, height: 1, leftEdge: "x", rightEdge: "y" },
      { id: "end", width: 1, height: 1, leftEdge: "y", rightEdge: "z" },
    ],
    rightEdge: "z",
  });
  if (!r.ok) throw new Error("Expected tag chain");
  expect(r.output.panels.map((p) => p.motifId)).toEqual(["start", "end"]);
  expect(r.output.panels[0].motifX).toBe(0.5);
  expect(
    tool.execute({ ...example.input, rightEdge: "missing" }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "motifs", code: "infeasible_panels" }] },
  });
});
