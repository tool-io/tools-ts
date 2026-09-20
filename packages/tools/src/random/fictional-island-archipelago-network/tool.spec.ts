import { expect, it } from "vitest";
import tool, {
  calculateFictionalIslandArchipelagoNetwork,
  example,
} from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(
  tool,
  calculateFictionalIslandArchipelagoNetwork,
  example,
);
it("lightweight independent disconnected archipelago keeps every isolated island", () => {
  expect(
    tool.execute({ ...example.input, edgeCount: 0, connected: false }),
  ).toMatchObject({ ok: true, output: { links: [], componentCount: 3 } });
  expect(tool.execute({ ...example.input, edgeCount: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "edgeCount", code: "infeasible_constraints" }] },
  });
});
