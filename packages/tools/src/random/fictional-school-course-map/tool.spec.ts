import { expect, it } from "vitest";
import tool, { calculateFictionalSchoolCourseMap, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalSchoolCourseMap, example);
it("lightweight independent cyclic alternative does not discard a feasible choice", () => {
  expect(
    tool.execute({
      courses: [
        { id: "a", prerequisiteOptions: [["a"], []] },
        { id: "b", prerequisiteOptions: [["a"]] },
      ],
      seed: 42,
    }),
  ).toMatchObject({
    ok: true,
    output: {
      courses: [
        { id: "a", prerequisites: [], level: 0 },
        { id: "b", prerequisites: ["a"], level: 1 },
      ],
      order: ["a", "b"],
    },
  });
});
it("lightweight independent mandatory cycle has no valid curriculum", () => {
  expect(
    tool.execute({
      courses: [
        { id: "a", prerequisiteOptions: [["b"]] },
        { id: "b", prerequisiteOptions: [["a"]] },
      ],
      seed: 42,
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
});
