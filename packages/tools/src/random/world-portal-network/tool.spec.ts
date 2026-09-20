import { expect, it } from "vitest";
import tool, { calculateWorldPortalNetwork, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateWorldPortalNetwork, example);
it("lightweight independent sibling branches cannot share an acquired flag", () => {
  expect(
    tool.execute({
      locations: [
        { id: "a", grantsFlagIds: [] },
        { id: "b", grantsFlagIds: ["key"] },
        { id: "c", grantsFlagIds: [] },
        { id: "d", grantsFlagIds: [] },
      ],
      flagIds: ["key"],
      initialFlagIds: [],
      start: "a",
      candidates: [
        { from: "a", to: "b", requiresFlagIds: [] },
        { from: "a", to: "c", requiresFlagIds: [] },
        { from: "c", to: "d", requiresFlagIds: ["key"] },
      ],
      portalCount: 3,
      requiredLocationIds: ["d"],
      seed: 42,
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
});
