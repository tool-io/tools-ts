import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedStartMinute: number;
  readonly independentlyEstablishedEndMinute: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedStartMinute",
    label: "Independently established start minute",
    kind: "number",
  },
  {
    id: "independentlyEstablishedEndMinute",
    label: "Independently established end minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyEstablishedEndMinute <
    input.independentlyEstablishedStartMinute
  )
    simpleError("timeline", "Actual stage end not before established start.");
  return {
    observedStageElapsedMinutes:
      input.independentlyEstablishedEndMinute -
      input.independentlyEstablishedStartMinute,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedStartMinute: 60,
    independentlyEstablishedEndMinute: 180,
  },
  output: { result: { observedStageElapsedMinutes: 120 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/labor-duration-total",
  title: "Total Labor Duration Calculator",
  description:
    "Actual independently clinically defined complete labour boundaries on one continuous clock. Stage onset/diagnosis established by qualified clinicians; elapsed time alone not abnormality, delivery timing or intervention threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
