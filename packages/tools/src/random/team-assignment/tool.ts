import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  bounded,
  unique,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly memberIds: readonly string[];
  readonly teamCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "memberIds", label: "Member ids", kind: "stringList" },
  { id: "teamCount", label: "Team count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.memberIds, "members");
  bounded(input.teamCount, "teams", 1, input.count);
  const chosen = indices(
    input.memberIds.length,
    { ...input, withoutReplacement: true },
    random,
  );
  return {
    result: {
      selectedMemberIds: chosen.map((i) => input.memberIds[i]),
      teamAssignments: chosen.map((i, j) => ({
        memberId: input.memberIds[i],
        teamIndex: j % input.teamCount,
      })),
      unassignedMemberIds: input.memberIds.filter(
        (_, i) => !chosen.includes(i),
      ),
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 2,
    memberIds: ["a", "b", "c"],
    teamCount: 2,
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/team-assignment",
  title: "Random Team Assignment Generator",
  description:
    "Uniform distinct member draw then round-robin assignment to indexed teams, yielding size difference at most one. Count is participating members; unselected inventory retained. Does not balance skill, protect privacy or infer fair eligibility.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
