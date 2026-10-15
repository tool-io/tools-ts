import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedNetOceanAddedMassGt: number;
  readonly callerMatchedOceanSurfaceAreaSquareMeters: number;
  readonly callerWaterDensityKgPerM3: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyQualifiedNetOceanAddedMassGt",
    label: "Actual independently qualified net ocean added mass gt",
    kind: "number",
  },
  {
    id: "callerMatchedOceanSurfaceAreaSquareMeters",
    label: "Caller matched ocean surface area square meters",
    kind: "number",
  },
  {
    id: "callerWaterDensityKgPerM3",
    label: "Caller water density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(
    input.callerMatchedOceanSurfaceAreaSquareMeters,
    "callerMatchedOceanSurfaceAreaSquareMeters",
  );
  positive(input.callerWaterDensityKgPerM3, "callerWaterDensityKgPerM3");
  return {
    value:
      (input.actualIndependentlyQualifiedNetOceanAddedMassGt * 1e15) /
      (input.callerMatchedOceanSurfaceAreaSquareMeters *
        input.callerWaterDensityKgPerM3),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlyQualifiedNetOceanAddedMassGt: 1,
    callerMatchedOceanSurfaceAreaSquareMeters: 1000000000000.0,
    callerWaterDensityKgPerM3: 1000,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/sea-level-equivalent-gt-mm",
  title: "Sea Level Equivalent GT MM Calculator",
  description:
    "Conditionaluniformsea-level-equivalentmmfromalreadyqualifiedNETaddedoceanmassGt,1Gt=1e12kg/no floatingdisplacementor sub-seabedcorrectionsinferred. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
