import { expect, it } from "vitest";
import tool, {
  calculateFantasyBorderCheckpointPlan,
  example,
} from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFantasyBorderCheckpointPlan, example);
it("lightweight independent same-realm links cannot host checkpoints; all templates validate", () => {
  expect(tool.execute({ ...example.input, checkpointCount: 2 })).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "infeasible_constraints", field: "checkpointCount" }],
    },
  });
  expect(
    tool.execute({
      ...example.input,
      permissionTemplates: [{ id: "bad", text: "{unknown}" }],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "invalid_template", field: "permissionTemplates" }],
    },
  });
});
