import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLaterSurfaceElevation: number;
  readonly actualEarlierSurfaceElevation: number;
  readonly actualElapsedYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualLaterSurfaceElevation",
    label: "Actual later surface elevation",
    kind: "number",
  },
  {
    id: "actualEarlierSurfaceElevation",
    label: "Actual earlier surface elevation",
    kind: "number",
  },
  { id: "actualElapsedYears", label: "Actual elapsed years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualElapsedYears, "actualElapsedYears");
  return {
    value:
      (input.actualLaterSurfaceElevation -
        input.actualEarlierSurfaceElevation) /
      input.actualElapsedYears,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualLaterSurfaceElevation: 9,
    actualEarlierSurfaceElevation: 10,
    actualElapsedYears: 2,
  },
  output: { result: { value: -0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/elevation-change-rate-dhdt",
  title: "Elevation Change Rate DHDT Calculator",
  description:
    "Signedactualsurfacedelevationrate(dh/dt),sameverticaldatumindependent,not bed-relativeicemassflux. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
