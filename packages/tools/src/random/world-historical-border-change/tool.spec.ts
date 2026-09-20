import { expect, it } from "vitest";
import tool, {
  calculateWorldHistoricalBorderChange,
  example,
} from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateWorldHistoricalBorderChange, example);
it("lightweight independent zero events retain initial state and bridge closures fail", () => {
  expect(tool.execute({ ...example.input, eventCount: 0 })).toMatchObject({
    ok: true,
    output: { events: [], snapshots: [{ step: 0, componentCount: 1 }] },
  });
  expect(
    tool.execute({ ...example.input, eventTypes: ["close"], eventCount: 1 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
});
