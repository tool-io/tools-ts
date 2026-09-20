import { expect, it } from "vitest";
import tool, {
  calculateCharacterRelationshipWeb,
  characterRelationshipWebExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
import { fcTopology } from "../m250-fiction-craft-graph.js";
import { createGeneratorRandom } from "../generator-random.js";
import { SimpleToolError } from "../../core/simple.js";
fictionCraftContractTests(tool, calculateCharacterRelationshipWeb, example);
it("counts endpoints independently and finds every vertex by traversal", () => {
  const r = tool.execute({ ...example.input, edgeCount: 2, minimumDegree: 1 });
  if (!r.ok) throw new Error("Expected path");
  for (const d of r.output.degrees)
    expect(d.degree).toBe(
      r.output.relationships.filter((e) => e.from === d.id || e.to === d.id)
        .length,
    );
  const seen = new Set(["ada"]);
  for (let pass = 0; pass < 3; pass++)
    for (const e of r.output.relationships) {
      if (seen.has(e.from)) seen.add(e.to);
      if (seen.has(e.to)) seen.add(e.from);
    }
  expect(seen.size).toBe(3);
});
it("rejects an ID ending with a newline rather than accepting a prefix", () => {
  expect(
    tool.execute({
      ...example.input,
      characters: [{ id: "ada\n", name: "Ada" }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "characters" }] },
  });
});
it("distinguishes a feasible graph's search exhaustion from proved edge infeasibility", () => {
  // A single undirected edge is feasible; one visited state cannot finish its DFS.
  try {
    fcTopology(["a", "b"], 1, 0, 1, true, createGeneratorRandom(42), 1);
    throw new Error("Expected bounded search failure");
  } catch (error) {
    expect(error).toBeInstanceOf(SimpleToolError);
    if (error instanceof SimpleToolError)
      expect(error.code).toBe("search_limit_exceeded");
  }
  // Two vertices have exactly one possible unordered pair, independently of RNG.
  try {
    fcTopology(["a", "b"], 2, 0, 2, false, createGeneratorRandom(42));
    throw new Error("Expected impossible cardinality");
  } catch (error) {
    expect(error).toBeInstanceOf(SimpleToolError);
    if (error instanceof SimpleToolError)
      expect(error.code).toBe("infeasible_constraints");
  }
});
it("rejects impossible degree/connectivity and duplicate identities", () => {
  expect(tool.execute({ ...example.input, maximumDegree: 1 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      characters: [example.input.characters[0], example.input.characters[0]],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_identity" }] },
  });
  expect(tool.execute({ ...example.input, edgeCount: 33 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "edgeCount", code: "invalid_field" }] },
  });
});
