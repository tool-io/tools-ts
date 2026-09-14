import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualInitialC14Amount: number;
  readonly actualRemainingC14Amount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialC14Amount",
    label: "Actual initial c14 amount",
    kind: "number",
  },
  {
    id: "actualRemainingC14Amount",
    label: "Actual remaining c14 amount",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualInitialC14Amount, "actualInitialC14Amount");
  positive(input.actualRemainingC14Amount, "actualRemainingC14Amount");
  if (input.actualRemainingC14Amount > input.actualInitialC14Amount)
    simpleError("amount", "0<remaining≤initial.");
  return {
    value:
      (5730 *
        Math.log(
          input.actualInitialC14Amount / input.actualRemainingC14Amount,
        )) /
      Math.LN2,
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
  input: { actualInitialC14Amount: 2, actualRemainingC14Amount: 1 },
  output: { result: { value: 5730 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/c14-decay-years",
  title: "Radiocarbon Half-Life Decay Years Calculator",
  description:
    "Uncalibratedphysical5730yearC14decayelapsedtime,NOTLibby5568conventionalradiocarbonage,calendarcalibration or initialactivity determination. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
