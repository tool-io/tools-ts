import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  sourceFor,
  shuffle,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualParticipants: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "actualParticipants",
    label: "Actual participants",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  unique(input.actualParticipants, "participants");
  if (input.actualParticipants.length < 2)
    simpleError("participants", "Atleasttwo.");
  const a = shuffle(input.actualParticipants, random);
  return { givers: a, receivers: a.slice(1).concat(a[0]) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", actualParticipants: ["A", "B", "C"] },
  output: {
    result: {
      givers: ["C", "A", "B"],
      receivers: ["A", "B", "C"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/secret-santa",
  title: "Secret Santa Assigner",
  description:
    "Randomsingle-cycleSecretSantaassignmentnoselfgifts,not uniformoverall derangementsor exclusionrule CSP. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          givers: { type: "array", items: { type: "string" } },
          receivers: { type: "array", items: { type: "string" } },
        },
        required: ["givers", "receivers"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
