import { expect, it } from "vitest";
import tool, {
  calculateQuestDependencyChain,
  questDependencyChainExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateQuestDependencyChain, example);
it("independently checks the complete forward DAG at probability one", () => {
  const r = tool.execute({
    ...example.input,
    count: 3,
    extraDependencyProbability: 1,
  });
  if (!r.ok) throw new Error("Expected quests");
  expect(r.output.edges).toEqual([
    { from: "quest-1", to: "quest-2" },
    { from: "quest-1", to: "quest-3" },
    { from: "quest-2", to: "quest-3" },
  ]);
  for (const e of r.output.edges)
    expect(r.output.topologicalOrder.indexOf(e.from)).toBeLessThan(
      r.output.topologicalOrder.indexOf(e.to),
    );
});
it("rejects duplicate objectives and impossible or excessive counts", () => {
  expect(tool.execute({ ...example.input, count: 4 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_objective_count" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      objectives: [example.input.objectives[0], example.input.objectives[0]],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_identity" }] },
  });
  expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
});
