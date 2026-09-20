import { expect, it } from "vitest";
import tool, {
  calculateFantasyGuildMembershipNetwork,
  example,
} from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFantasyGuildMembershipNetwork, example);
it("lightweight independent zero quotas retain all isolated residents and guilds", () => {
  expect(
    tool.execute({
      ...example.input,
      guilds: example.input.guilds.map((g) => ({ ...g, quota: 0 })),
    }),
  ).toMatchObject({ ok: true, output: { memberships: [], componentCount: 5 } });
  expect(
    tool.execute({ ...example.input, maximumMembershipsPerResident: 0 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
});
