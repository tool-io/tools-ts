import {
  runImprovObjectTransformation as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateImprovObjectTransformation as calculate,
  improvObjectTransformationExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent theme exclusion leaves one permitted first turn", () => {
  const result = calculate({
    ...example.input,
    excludedThemes: ["sky"],
    turnCount: 1,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.turns.map((t) => t.interpretationId)).toEqual(["boat"]);
  expect(result.output.turns[0].handoffTo).toBeNull();
});
it("lightweight exclusion diversity and exact token boundary", () => {
  expect(
    calculate({ ...example.input, excludedThemes: ["sky"] }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "excludedThemes", code: "infeasible_transformations" }],
    },
  });
  expect(
    calculate({ ...example.input, excludedThemes: ["sky\n"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "excludedThemes", code: "invalid_field" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
