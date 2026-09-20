import { expect, it } from "vitest";
import tool, {
  calculateFantasyFestivalDistrictPlan,
  example,
} from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFantasyFestivalDistrictPlan, example);
it("lightweight independent empty plan and exhausted capacity boundaries", () => {
  expect(tool.execute({ ...example.input, events: [] })).toMatchObject({
    ok: true,
    output: { assignments: [], occupiedComponentCount: 0 },
  });
  expect(
    tool.execute({
      ...example.input,
      districts: example.input.districts.map((d) => ({ ...d, capacity: 0 })),
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
});
