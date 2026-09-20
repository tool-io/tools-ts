import { expect, it } from "vitest";
import tool, { example, calculateScrapbookPageLayout } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateScrapbookPageLayout);
it("lightweight overlap permission and out-of-page diagnostics", () => {
  const slots = example.input.slots.map((s) => ({ ...s, y: 0 }));
  expect(tool.execute({ ...example.input, slots })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "blocks", code: "infeasible_layout" }] },
  });
  const r = tool.execute({
    ...example.input,
    slots,
    blocks: example.input.blocks.map((b) => ({ ...b, allowOverlap: true })),
  });
  if (!r.ok) throw new Error("Expected allowed overlap");
  expect(r.output.summedBlockArea).toBe(6);
  expect(
    tool.execute({
      ...example.input,
      slots: slots.map((s) => ({ ...s, x: 4 })),
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "slots", code: "outside_page" }] },
  });
});
