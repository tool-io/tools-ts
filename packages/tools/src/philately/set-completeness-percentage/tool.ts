import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly requiredIssueIds: readonly string[];
  readonly ownedIssueIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly completenessPercent: number;
  readonly missingIssueIds: readonly string[];
  readonly duplicateOwnedIssueIds: readonly string[];
  readonly outsideSetIssueIds: readonly string[];
}>;
const inputFields = [
  { id: "requiredIssueIds", label: "Required issue ids", kind: "stringList" },
  { id: "ownedIssueIds", label: "Owned issue ids", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.requiredIssueIds, "set");
  const owned = new Set(input.ownedIssueIds);
  return {
    completenessPercent:
      (100 * input.requiredIssueIds.filter((v) => owned.has(v)).length) /
      input.requiredIssueIds.length,
    missingIssueIds: input.requiredIssueIds.filter((v) => !owned.has(v)),
    duplicateOwnedIssueIds: [...owned].filter(
      (v) => input.ownedIssueIds.filter((w) => v === w).length > 1,
    ),
    outsideSetIssueIds: [...owned].filter(
      (v) => !input.requiredIssueIds.includes(v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredIssueIds: ["a", "b", "c"],
  ownedIssueIds: ["a", "a", "x"],
} satisfies Input;
export const exampleOutput = {
  completenessPercent: 33.3333333333333,
  missingIssueIds: ["b", "c"],
  duplicateOwnedIssueIds: ["a"],
  outsideSetIssueIds: ["x"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/set-completeness-percentage",
  title: "Set Completeness Percentage Calculator",
  description:
    "Audit exact issue IDs for set completeness, separating duplicates and off-set inventory. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "completenessPercent",
      label: "Completeness percent",
      kind: "number",
    },
    { id: "missingIssueIds", label: "Missing issue ids", kind: "stringList" },
    {
      id: "duplicateOwnedIssueIds",
      label: "Duplicate owned issue ids",
      kind: "stringList",
    },
    {
      id: "outsideSetIssueIds",
      label: "Outside set issue ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredIssueIds: value.requiredIssueIds as readonly string[],
      ownedIssueIds: value.ownedIssueIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
