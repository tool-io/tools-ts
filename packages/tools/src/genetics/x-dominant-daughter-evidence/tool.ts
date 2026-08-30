import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly affectedFatherIds: readonly string[];
  readonly daughterCounts: readonly number[];
  readonly affectedDaughterCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly allDaughtersAffectedFathers: readonly string[];
  readonly contradictoryFatherIds: readonly string[];
  readonly allAssessedFamiliesConsistent: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.affectedFatherIds, input.daughterCounts, "affectedFatherIds");
  aligned(
    input.affectedFatherIds,
    input.affectedDaughterCounts,
    "affectedFatherIds",
  );
  input.daughterCounts.forEach((v) => count(v, "daughterCounts", 1));
  input.affectedDaughterCounts.forEach((v, i) => {
    count(v, "affectedDaughterCounts");
    if (v > input.daughterCounts[i])
      simpleError(
        "affectedDaughterCounts",
        "Affected daughters cannot exceed total daughters.",
      );
  });
  const allDaughtersAffectedFathers = input.affectedFatherIds.filter(
      (_, i) => input.affectedDaughterCounts[i] === input.daughterCounts[i],
    ),
    contradictoryFatherIds = input.affectedFatherIds.filter(
      (_, i) => input.affectedDaughterCounts[i] < input.daughterCounts[i],
    );
  return {
    allDaughtersAffectedFathers,
    contradictoryFatherIds,
    allAssessedFamiliesConsistent: contradictoryFatherIds.length === 0,
  };
};
export const exampleInput = {
  affectedFatherIds: ["A", "B"],
  daughterCounts: [2, 1],
  affectedDaughterCounts: [2, 0],
} satisfies Input;
export const exampleOutput = {
  allDaughtersAffectedFathers: ["A"],
  contradictoryFatherIds: ["B"],
  allAssessedFamiliesConsistent: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/x-dominant-daughter-evidence",
  title: "X Dominant Daughter Evidence",
  description:
    "Audit affected-father daughter observations against a fully penetrant X-dominant model.",
  inputs: [
    {
      id: "affectedFatherIds",
      label: "Affected father ids",
      kind: "stringList",
    },
    { id: "daughterCounts", label: "Daughter counts", kind: "numberList" },
    {
      id: "affectedDaughterCounts",
      label: "Affected daughter counts",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "allDaughtersAffectedFathers",
      label: "All daughters affected fathers",
      kind: "stringList",
    },
    {
      id: "contradictoryFatherIds",
      label: "Contradictory father ids",
      kind: "stringList",
    },
    {
      id: "allAssessedFamiliesConsistent",
      label: "All assessed families consistent",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      affectedFatherIds: value.affectedFatherIds as readonly string[],
      daughterCounts: value.daughterCounts as readonly number[],
      affectedDaughterCounts: value.affectedDaughterCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
