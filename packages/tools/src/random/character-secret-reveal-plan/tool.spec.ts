import {
  runCharacterSecretRevealPlan as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateCharacterSecretRevealPlan as calculate,
  characterSecretRevealPlanExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent prior knowledge permits direct vault discovery", () => {
  const result = calculate({
    ...example.input,
    beats: [{ id: "only", discovererIds: ["m"] }],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.reveals[0]).toMatchObject({
    secretId: "vault",
    knownBefore: ["key"],
    knownAfter: ["key", "vault"],
  });
});
it("lightweight knowledge infeasibility and invalid references", () => {
  expect(
    calculate({
      ...example.input,
      beats: [...example.input.beats, { id: "b3", discovererIds: ["i"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "beats", code: "infeasible_knowledge" }] },
  });
  expect(
    calculate({
      ...example.input,
      characters: [{ id: "m", known: ["missing"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "characters.known", code: "invalid_reference" }],
    },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
