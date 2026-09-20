import { expect, it } from "vitest";
import tool, { example, calculateGreetingCardFoldLayout } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateGreetingCardFoldLayout);
it("lightweight accordion fold alternation and duplicate identity", () => {
  const t = example.input.templates[0],
    r = tool.execute({
      templates: [{ ...t, panelRoles: ["a", "b", "c", "d"] }],
      seed: 42,
    });
  if (!r.ok) throw new Error("Expected panels");
  expect(r.output.folds).toEqual([
    { x: 3, kind: "valley" },
    { x: 6, kind: "mountain" },
    { x: 9, kind: "valley" },
  ]);
  expect(tool.execute({ templates: [t, t] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "templates", code: "duplicate_entries" }] },
  });
});
