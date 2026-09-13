import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyObservedCompleteBlinkCount: number;
  readonly actualValidObservationSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyObservedCompleteBlinkCount",
    label: "Actual independently observed complete blink count",
    kind: "number",
  },
  {
    id: "actualValidObservationSeconds",
    label: "Actual valid observation seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualIndependentlyObservedCompleteBlinkCount,
    "actualIndependentlyObservedCompleteBlinkCount",
    0,
    1000000,
  );
  positive(
    input.actualValidObservationSeconds,
    "actualValidObservationSeconds",
  );
  return {
    value:
      (60 * input.actualIndependentlyObservedCompleteBlinkCount) /
      input.actualValidObservationSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyObservedCompleteBlinkCount: 2,
    actualValidObservationSeconds: 4,
  },
  output: { result: { value: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/blink-rate-vr",
  title: "Blink Rate VR Calculator",
  description:
    "Actual separately observed complete blink count/valid exposure seconds times60/minute, not automated blink event detector or dry-eye/fatigue clinical diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
