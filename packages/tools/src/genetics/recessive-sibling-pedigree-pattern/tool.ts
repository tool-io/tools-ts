import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly familyIds: readonly string[];
  readonly motherAffectedFlags: readonly number[];
  readonly fatherAffectedFlags: readonly number[];
  readonly affectedSiblingCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly horizontalClusterFamilies: readonly string[];
  readonly consistentFamilyCount: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.familyIds, input.motherAffectedFlags, "familyIds");
  aligned(input.familyIds, input.fatherAffectedFlags, "familyIds");
  aligned(input.familyIds, input.affectedSiblingCounts, "familyIds");
  if (
    input.motherAffectedFlags.some((v) => v !== 0 && v !== 1) ||
    input.fatherAffectedFlags.some((v) => v !== 0 && v !== 1)
  )
    simpleError(
      "motherAffectedFlags",
      "Binary parental phenotype flags required.",
    );
  input.affectedSiblingCounts.forEach((v) => count(v, "affectedSiblingCounts"));
  const horizontalClusterFamilies = input.familyIds.filter(
    (_, i) =>
      input.motherAffectedFlags[i] === 0 &&
      input.fatherAffectedFlags[i] === 0 &&
      input.affectedSiblingCounts[i] >= 2,
  );
  return {
    horizontalClusterFamilies,
    consistentFamilyCount: horizontalClusterFamilies.length,
  };
};
export const exampleInput = {
  familyIds: ["A", "B"],
  motherAffectedFlags: [0, 1],
  fatherAffectedFlags: [0, 0],
  affectedSiblingCounts: [2, 1],
} satisfies Input;
export const exampleOutput = {
  horizontalClusterFamilies: ["A"],
  consistentFamilyCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/recessive-sibling-pedigree-pattern",
  title: "Recessive Sibling Pedigree Pattern",
  description:
    "Locate affected-sibling clusters with unaffected parents; pattern evidence is not proof of recessive inheritance.",
  inputs: [
    { id: "familyIds", label: "Family ids", kind: "stringList" },
    {
      id: "motherAffectedFlags",
      label: "Mother affected flags",
      kind: "numberList",
    },
    {
      id: "fatherAffectedFlags",
      label: "Father affected flags",
      kind: "numberList",
    },
    {
      id: "affectedSiblingCounts",
      label: "Affected sibling counts",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "horizontalClusterFamilies",
      label: "Horizontal cluster families",
      kind: "stringList",
    },
    {
      id: "consistentFamilyCount",
      label: "Consistent family count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      familyIds: value.familyIds as readonly string[],
      motherAffectedFlags: value.motherAffectedFlags as readonly number[],
      fatherAffectedFlags: value.fatherAffectedFlags as readonly number[],
      affectedSiblingCounts: value.affectedSiblingCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
