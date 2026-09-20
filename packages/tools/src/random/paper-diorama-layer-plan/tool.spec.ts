import { expect, it } from "vitest";
import tool, { example, calculatePaperDioramaLayerPlan } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculatePaperDioramaLayerPlan);
it("lightweight centered fit and attachment-tag incompatibility", () => {
  const r = tool.execute({
    ...example.input,
    width: 6,
    layers: [
      {
        ...example.input.layers[0],
        zones: [
          { id: "side", attachmentTag: "tab", x: 2, y: 0, width: 4, height: 3 },
        ],
      },
    ],
  });
  if (!r.ok) throw new Error("Expected centered silhouette");
  expect(r.output.placements[0]).toMatchObject({ x: 3, y: 0.5 });
  expect(
    tool.execute({
      ...example.input,
      silhouettes: [
        { ...example.input.silhouettes[0], attachmentTags: ["slot"] },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "silhouettes", code: "infeasible_layers" }] },
  });
});
