import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualGeodeticThicknessChangeRate: number;
  readonly callerIndependentNonMassFirnCompactionRate: number;
  readonly callerApplicableBulkMassDensity: number;
  readonly callerWaterReferenceDensity: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualGeodeticThicknessChangeRate",
    label: "Actual geodetic thickness change rate",
    kind: "number",
  },
  {
    id: "callerIndependentNonMassFirnCompactionRate",
    label: "Caller independent non mass firn compaction rate",
    kind: "number",
  },
  {
    id: "callerApplicableBulkMassDensity",
    label: "Caller applicable bulk mass density",
    kind: "number",
  },
  {
    id: "callerWaterReferenceDensity",
    label: "Caller water reference density",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(
    input.callerApplicableBulkMassDensity,
    "callerApplicableBulkMassDensity",
  );
  positive(input.callerWaterReferenceDensity, "callerWaterReferenceDensity");
  return {
    value:
      ((input.actualGeodeticThicknessChangeRate -
        input.callerIndependentNonMassFirnCompactionRate) *
        input.callerApplicableBulkMassDensity) /
      input.callerWaterReferenceDensity,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualGeodeticThicknessChangeRate: -1,
    callerIndependentNonMassFirnCompactionRate: -0.2,
    callerApplicableBulkMassDensity: 500,
    callerWaterReferenceDensity: 1000,
  },
  output: { result: { value: -0.4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/geodetic-mass-balance-density-correction",
  title: "Geodetic Mass Balance Density Correction Calculator",
  description:
    "Conditionalgeodeticwaterequivalentbalanceafter independentlyseparated nonmassfirncompaction,\u03c1applicable/\u03c1water;no inferdensitycorrectionfromelevation alone. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
