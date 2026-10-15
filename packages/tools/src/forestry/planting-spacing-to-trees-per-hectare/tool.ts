import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAlongRowSpacingMeters: number;
  readonly actualBetweenRowSpacingMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualAlongRowSpacingMeters",
    label: "Actual along row spacing meters",
    kind: "number",
  },
  {
    id: "actualBetweenRowSpacingMeters",
    label: "Actual between row spacing meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualAlongRowSpacingMeters, "actualAlongRowSpacingMeters");
  positive(
    input.actualBetweenRowSpacingMeters,
    "actualBetweenRowSpacingMeters",
  );
  return {
    value:
      10000 /
      (input.actualAlongRowSpacingMeters * input.actualBetweenRowSpacingMeters),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAlongRowSpacingMeters: 2, actualBetweenRowSpacingMeters: 2 },
  output: { result: { value: 2500 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/planting-spacing-to-trees-per-hectare",
  title: "Planting Spacing to Trees/Hectare Converter",
  description:
    "Idealfullrectangularuniformplantingdensity trees/ha,no observedcensusor setbacks/paths/mortality. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
