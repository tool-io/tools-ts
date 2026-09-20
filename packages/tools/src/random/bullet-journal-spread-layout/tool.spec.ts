import { expect, it } from "vitest";
import tool, { example, calculateBulletJournalSpreadLayout } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateBulletJournalSpreadLayout);
it("lightweight stacking conserves heights and rejects side overflow", () => {
  const blocks = example.input.blocks.map((b) => ({
      ...b,
      allowedSides: ["left"],
    })),
    r = tool.execute({ ...example.input, blocks });
  if (!r.ok) throw new Error("Expected stack");
  expect(r.output.placements.map((p) => p.y)).toEqual([0, 2]);
  expect(
    tool.execute({ ...example.input, pageHeight: 4, blocks }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "blocks", code: "infeasible_layout" }] },
  });
});
