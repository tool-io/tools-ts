import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualRequiredContinuousFabricLengthMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRequiredContinuousFabricLengthMeters",
    label: "Actual required continuous fabric length meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualRequiredContinuousFabricLengthMeters,
    "actualRequiredContinuousFabricLengthMeters",
  );
  return { value: input.actualRequiredContinuousFabricLengthMeters / 0.9144 };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualRequiredContinuousFabricLengthMeters: 1.8288 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/fabric-yardage-calculator",
  title: "Fabric Yardage from Flag Dimensions Calculator",
  description:
    "Actualalreadylaid-outcontinuousfabriclengthmeters\u2192linearUSyards EXACT.9144m,not areadividedwidthwith inventedlayout/yield. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
