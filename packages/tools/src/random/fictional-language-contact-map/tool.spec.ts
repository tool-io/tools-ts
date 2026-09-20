import { expect, it } from "vitest";
import tool, {
  calculateFictionalLanguageContactMap,
  example,
} from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalLanguageContactMap, example);
it("lightweight independent minimum quotas cannot exceed regions", () => {
  expect(
    tool.execute({ ...example.input, minimumRegionsPerLanguage: 2 }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [
        { field: "minimumRegionsPerLanguage", code: "infeasible_constraints" },
      ],
    },
  });
});
