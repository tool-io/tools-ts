import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFlagHoistCm: number;
  readonly actualFlagFlyCm: number;
  readonly actualFabricLayerCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFlagHoistCm", label: "Actual flag hoist cm", kind: "number" },
  { id: "actualFlagFlyCm", label: "Actual flag fly cm", kind: "number" },
  {
    id: "actualFabricLayerCount",
    label: "Actual fabric layer count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualFlagHoistCm, "actualFlagHoistCm");
  positive(input.actualFlagFlyCm, "actualFlagFlyCm");
  bounded(input.actualFabricLayerCount, "actualFabricLayerCount", 1, 1000000);
  return {
    value:
      input.actualFlagHoistCm *
      input.actualFlagFlyCm *
      input.actualFabricLayerCount,
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
    actualFlagHoistCm: 2,
    actualFlagFlyCm: 3,
    actualFabricLayerCount: 4,
  },
  output: { result: { value: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/fabric-area-cm2",
  title: "Flag Size Fabric Area Calculator cm\u00b2",
  description:
    "Actualrectangularfinishedflagfabricarea cm\u00b2inclindependentlyselectedlayers,not scalarrectanglealone/allowancesorpolewindarea. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
