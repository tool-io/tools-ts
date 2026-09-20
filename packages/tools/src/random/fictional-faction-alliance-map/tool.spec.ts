import { expect, it } from "vitest";
import tool, {
  calculateFictionalFactionAllianceMap,
  fictionalFactionAllianceMapExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateFictionalFactionAllianceMap, example);
it("independent reciprocal sampling can disagree without changing pair degrees", () => {
  expect(
    tool.execute({ ...example.input, reciprocalPolicy: "independent" }),
  ).toMatchObject({
    ok: true,
    output: {
      relationships: [{ type: "rival" }, { type: "neutral" }],
      degrees: [{ degree: 1 }, { degree: 1 }],
    },
  });
});
it("rejects disconnected constraints, duplicate labels and oversized networks", () => {
  expect(tool.execute({ ...example.input, pairCount: 0 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
  expect(
    tool.execute({ ...example.input, relationshipTypes: ["ally", "ally"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_identity" }] },
  });
  expect(tool.execute({ ...example.input, pairCount: 33 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "pairCount" }] },
  });
});
