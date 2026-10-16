import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualStationEastVelocity: number;
  readonly actualStationNorthVelocity: number;
  readonly actualStationUpVelocity: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualStationEastVelocity",
    label: "Actual station east velocity",
    kind: "number",
  },
  {
    id: "actualStationNorthVelocity",
    label: "Actual station north velocity",
    kind: "number",
  },
  {
    id: "actualStationUpVelocity",
    label: "Actual station up velocity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return {
    speedMagnitude: Math.hypot(
      input.actualStationEastVelocity,
      input.actualStationNorthVelocity,
      input.actualStationUpVelocity,
    ),
    horizontalSpeed: Math.hypot(
      input.actualStationEastVelocity,
      input.actualStationNorthVelocity,
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualStationEastVelocity: -3,
    actualStationNorthVelocity: 4,
    actualStationUpVelocity: 0,
  },
  output: { result: { speedMagnitude: 5, horizontalSpeed: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/station-component-velocity-vector",
  title: "Station Component Velocity Vector Calculator",
  description:
    "ActualindependentlysurveyedlocalENUvelocitymagnitudes,norefereceframe/geodesyconversion or inferredice dynamics. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          speedMagnitude: { type: "number" },
          horizontalSpeed: { type: "number" },
        },
        required: ["speedMagnitude", "horizontalSpeed"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
