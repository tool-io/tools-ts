import { expect, it } from "vitest";
import tool, { calculateWorldResourceDepositLayout, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateWorldResourceDepositLayout, example);
it("lightweight independent empty resource counts leave null cells and no components", () => {
  expect(
    tool.execute({
      ...example.input,
      resources: example.input.resources.map((r) => ({ ...r, count: 0 })),
    }),
  ).toMatchObject({
    ok: true,
    output: {
      cells: [{ resourceId: null }, { resourceId: null }, { resourceId: null }],
      resourceComponents: [{ components: 0 }, { components: 0 }],
    },
  });
  expect(
    tool.execute({
      ...example.input,
      resources: [{ id: "ore", count: 4, forbidNeighborWithIds: [] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "resources", code: "infeasible_constraints" }] },
  });
});
