import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, assignRoles } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualParticipantIds: readonly string[];
  readonly actualIndependentlyAssignedRoleIds: readonly string[];
  readonly completedRotationCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualParticipantIds",
    label: "Actual participant ids",
    kind: "stringList",
  },
  {
    id: "actualIndependentlyAssignedRoleIds",
    label: "Actual independently assigned role ids",
    kind: "stringList",
  },
  {
    id: "completedRotationCount",
    label: "Completed rotation count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return assignRoles(
    input.actualParticipantIds,
    input.actualIndependentlyAssignedRoleIds,
    input.completedRotationCount,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualParticipantIds: ["a", "b"],
    actualIndependentlyAssignedRoleIds: ["reader", "recorder"],
    completedRotationCount: 1,
  },
  output: {
    result: {
      participantIds: ["a", "b"],
      assignedRoleIds: ["recorder", "reader"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/team-role-rotation-scheduler",
  title: "Survey Team Role Assignment Rotation Scheduler",
  description:
    "Deterministic cyclic rotation of actual equally sized survey participant/role inventories. Training, accessibility and qualification external; not automatically assign unqualified safety roles.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
