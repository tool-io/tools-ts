import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  unique,
  sourceFor,
  shuffle,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualParticipants: readonly string[];
  readonly callerActualRoleInventory: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "actualParticipants",
    label: "Actual participants",
    kind: "stringList",
  },
  {
    id: "callerActualRoleInventory",
    label: "Caller actual role inventory",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  unique(input.actualParticipants, "players");
  aligned(input.actualParticipants, input.callerActualRoleInventory, "roles");
  if (input.callerActualRoleInventory.some((v) => !v.trim()))
    simpleError("roles", "Nonblankactualrolecards.");
  return {
    participants: [...input.actualParticipants],
    assignedRoles: shuffle(input.callerActualRoleInventory, random),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    seed: "batch51",
    actualParticipants: ["A", "B", "C"],
    callerActualRoleInventory: ["Werewolf", "Villager", "Villager"],
  },
  output: {
    result: {
      participants: ["A", "B", "C"],
      assignedRoles: ["Villager", "Werewolf", "Villager"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/werewolf-role-dealer",
  title: "Werewolf Role Dealer",
  description:
    "Actual Werewolf independentlyspecifiedrole-inventorydeal,uniformcardpositions/oneadvancingsource;not selectgamebalance or inferplayers. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
