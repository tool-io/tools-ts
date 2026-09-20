import { expect, it } from "vitest";
import tool, { example, calculateCrochetStripeSequence } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateCrochetStripeSequence);
it("lightweight quota forces a different exact composition", () => {
  const r = tool.execute({
    ...example.input,
    colors: [
      { id: "red", maximumRows: 4 },
      { id: "blue", maximumRows: 2 },
    ],
  });
  if (!r.ok) throw new Error("Expected quota assignment");
  expect(r.output.stripes.map((s) => s.colorId)).toEqual([
    "red",
    "blue",
    "red",
  ]);
  expect(r.output.rowTotals).toEqual([
    { id: "red", rows: 4 },
    { id: "blue", rows: 2 },
  ]);
  expect(tool.execute({ ...example.input, totalRows: 5 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "totalRows", code: "infeasible_sequence" }] },
  });
});
