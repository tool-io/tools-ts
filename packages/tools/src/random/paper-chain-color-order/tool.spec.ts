import { expect, it } from "vitest";
import tool, { example, calculatePaperChainColorOrder } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculatePaperChainColorOrder);
it("lightweight single-color feasibility and forbidden adjacency", () => {
  expect(tool.execute({ ...example.input, colors: ["red"] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "colors", code: "infeasible_sequence" }] },
  });
  const r = tool.execute({
    ...example.input,
    colors: ["red"],
    linkCount: 2,
    maximumRun: 2,
  });
  if (!r.ok) throw new Error("Expected run");
  expect(r.output.links).toEqual(["red", "red"]);
  expect(
    tool.execute({ ...example.input, forbiddenNeighbors: [["red", "green"]] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "forbiddenNeighbors", code: "unknown_color" }] },
  });
});
