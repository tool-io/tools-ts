import { expect, it } from "vitest";
import tool, { example, calculateOrigamiPaperSelectionDeck } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateOrigamiPaperSelectionDeck);
it("lightweight compatibility excludes wrong tags and limits stock", () => {
  expect(
    tool.execute({
      ...example.input,
      papers: [{ ...example.input.papers[0], tags: [] }],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "count", code: "insufficient_compatible_stock" }],
    },
  });
  const r = tool.execute({ ...example.input, count: 1 });
  if (!r.ok) throw new Error("Expected card");
  expect(r.output.remainingStock).toEqual([{ id: "blue", count: 1 }]);
});
