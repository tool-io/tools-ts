import { expect, it } from "vitest";
import tool, {
  calculateFantasyFortressRoomHierarchy,
  example,
} from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFantasyFortressRoomHierarchy, example);
it("lightweight independent cross-zone child requires a gateway parent", () => {
  expect(tool.execute({ ...example.input, gatewayRoleIds: [] })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
  expect(tool.execute({ ...example.input, maximumChildren: 0 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
});
