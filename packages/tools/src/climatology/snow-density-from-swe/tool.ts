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
  readonly actualObservedSnowWaterEquivalentMeters: number;
  readonly callerWaterDensity: number;
  readonly actualObservedSnowDepthMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualObservedSnowWaterEquivalentMeters",
    label: "Actual observed snow water equivalent meters",
    kind: "number",
  },
  { id: "callerWaterDensity", label: "Caller water density", kind: "number" },
  {
    id: "actualObservedSnowDepthMeters",
    label: "Actual observed snow depth meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.actualObservedSnowWaterEquivalentMeters,
    "actualObservedSnowWaterEquivalentMeters",
  );
  positive(input.callerWaterDensity, "callerWaterDensity");
  positive(
    input.actualObservedSnowDepthMeters,
    "actualObservedSnowDepthMeters",
  );
  return {
    value:
      (input.actualObservedSnowWaterEquivalentMeters *
        input.callerWaterDensity) /
      input.actualObservedSnowDepthMeters,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualObservedSnowWaterEquivalentMeters: 0.2,
    callerWaterDensity: 1000,
    actualObservedSnowDepthMeters: 1,
  },
  output: { result: { value: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/snow-density-from-swe",
  title: "Snow Density from SWE Calculator",
  description:
    "InverseobservedSWE/depthbulksnowdensity,no inferredsnowpackstratigraphy/avalanchesafety. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
