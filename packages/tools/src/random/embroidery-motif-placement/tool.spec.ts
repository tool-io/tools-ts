import { expect, it } from "vitest";
import tool, { example, calculateEmbroideryMotifPlacement } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateEmbroideryMotifPlacement);
it("lightweight row transition and honest policy failure", () => {
  const r = tool.execute({ ...example.input, width: 3, height: 5, gap: 1 });
  if (!r.ok) throw new Error("Expected shelves");
  expect(r.output.placements.map((p) => [p.x, p.y])).toEqual([
    [0, 0],
    [0, 3],
  ]);
  expect(tool.execute({ ...example.input, width: 2, height: 2 })).toMatchObject(
    { ok: false, error: { issues: [{ field: "count", code: "no_fit" }] } },
  );
});
