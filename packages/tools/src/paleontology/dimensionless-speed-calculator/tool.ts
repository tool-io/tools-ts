import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentSpeed: number;
  readonly callerGravity: number;
  readonly actualIndependentHipHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentSpeed",
    label: "Actual independent speed",
    kind: "number",
  },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  {
    id: "actualIndependentHipHeight",
    label: "Actual independent hip height",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualIndependentSpeed, "actualIndependentSpeed");
  positive(input.callerGravity, "callerGravity");
  positive(input.actualIndependentHipHeight, "actualIndependentHipHeight");
  return {
    value:
      input.actualIndependentSpeed /
      Math.sqrt(input.callerGravity * input.actualIndependentHipHeight),
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
    actualIndependentSpeed: 2,
    callerGravity: 1,
    actualIndependentHipHeight: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/dimensionless-speed-calculator",
  title: "Dynamic Similarity Dimensionless Speed Calculator",
  description:
    "Dynamic similaritySPEEDv/\u221a(gh),not Froudenumberv\u00b2/(gh),trackwayAlexanderinversionor guaranteedgait. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
