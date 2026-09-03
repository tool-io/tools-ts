import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stageAudit } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerObservedBarreOrderStageIds: readonly string[];
  readonly callerStageDeclaredOrder: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingDeclaredStageIds: readonly string[];
  readonly orderInversionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedBarreOrderStageIds",
    label: "Caller observed barre order stage ids",
    kind: "stringList",
  },
  {
    id: "callerStageDeclaredOrder",
    label: "Caller stage declared order",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return stageAudit(
    input.callerObservedBarreOrderStageIds,
    input.callerStageDeclaredOrder,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedBarreOrderStageIds: ["plies", "grands-battements"],
  callerStageDeclaredOrder: [
    "plies",
    "tendus",
    "degages",
    "ronds-de-jambe",
    "fondus",
    "frappes",
    "adage",
    "grands-battements",
  ],
} satisfies Input;
export const exampleOutput = {
  missingDeclaredStageIds: [
    "tendus",
    "degages",
    "ronds-de-jambe",
    "fondus",
    "frappes",
    "adage",
  ],
  orderInversionIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/barre-exercise-order-standard-sequence-lookup",
  title: "Barre Exercise Order Standard Sequence Lookup",
  description:
    "Audit caller verified ballet-method barre order variant; not a universal safe warmup or prescribed exercises. Audit exact supplied observed stages against the independently verified declared order, not pedagogical/performance efficacy. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingDeclaredStageIds",
      label: "Missing declared stage ids",
      kind: "stringList",
    },
    {
      id: "orderInversionIndices",
      label: "Order inversion indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedBarreOrderStageIds:
        value.callerObservedBarreOrderStageIds as readonly string[],
      callerStageDeclaredOrder:
        value.callerStageDeclaredOrder as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
