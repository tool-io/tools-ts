import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{
  unspikedConcentration: number;
  spikedMeasuredConcentration: number;
  addedConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "unspikedConcentration",
    label: "Unspiked concentration",
    kind: "number",
  },
  {
    id: "spikedMeasuredConcentration",
    label: "Spiked measured concentration",
    kind: "number",
  },
  { id: "addedConcentration", label: "Added concentration", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.unspikedConcentration, "unspiked");
  nonnegative(i.spikedMeasuredConcentration, "spiked");
  positive(i.addedConcentration, "added");
  return {
    signedRecoveryPercent:
      (100 * (i.spikedMeasuredConcentration - i.unspikedConcentration)) /
      i.addedConcentration,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    unspikedConcentration: 10,
    spikedMeasuredConcentration: 14,
    addedConcentration: 5,
  },
  output: { result: { signedRecoveryPercent: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/recovery-percent-standard-addition",
  title: "Recovery Percent Spiked Sample Standard Addition Calculator",
  description:
    "Compute spike recovery after subtracting endogenous unspiked concentration; preserve negative discrepancies rather than clamp them.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
