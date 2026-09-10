import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBaselineCervicalLengthCm: number;
  readonly independentlyMeasuredRemainingCervicalLengthCm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedBaselineCervicalLengthCm",
    label: "Caller verified baseline cervical length cm",
    kind: "number",
  },
  {
    id: "independentlyMeasuredRemainingCervicalLengthCm",
    label: "Independently measured remaining cervical length cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerVerifiedBaselineCervicalLengthCm, "baseline");
  nonnegative(
    input.independentlyMeasuredRemainingCervicalLengthCm,
    "remaining",
  );
  return {
    conditionalReferenceShorteningPercent:
      100 *
      (1 -
        input.independentlyMeasuredRemainingCervicalLengthCm /
          input.callerVerifiedBaselineCervicalLengthCm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedBaselineCervicalLengthCm: 3,
    independentlyMeasuredRemainingCervicalLengthCm: 1.5,
  },
  output: { result: { conditionalReferenceShorteningPercent: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/effacement-percentage",
  title: "Effacement Percentage Calculator",
  description:
    "Conditional geometric percentage cervical shortening versus explicit independent compatible baseline. Not clinically observed effacement from an arbitrary ultrasound length, labour diagnosis or an indication to self-examine.",
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
