import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFlow: number;
  readonly secondFlow: number;
  readonly elapsed: number;
};
export type Output = { readonly volumeIncrement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFlow: { type: "number" },
    secondFlow: { type: "number" },
    elapsed: { type: "number", minimum: 0 },
  },
  required: ["firstFlow", "secondFlow", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeIncrement: { type: "number" } },
  required: ["volumeIncrement"],
} as const;
/** Integrate one supplied bench-flow interval with a trapezoidal rule, retaining sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFlow, secondFlow, elapsed } = request;
  const compute = (): Output => {
    H.domain(elapsed >= 0);
    return { volumeIncrement: (firstFlow / 2 + secondFlow / 2) * elapsed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFlow: 2, secondFlow: 4, elapsed: 3 },
  output: { volumeIncrement: 9 },
} satisfies ToolExample<Input, Output>;
export const flowVolumeIntegrationStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/flow-volume-integration-step",
    title: "Flow Volume Integration Step Tool",
    description:
      "Integrate one supplied bench-flow interval with a trapezoidal rule, retaining sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFlow: { type: "number" },
        secondFlow: { type: "number" },
        elapsed: { type: "number", minimum: 0 },
      },
      required: ["firstFlow", "secondFlow", "elapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumeIncrement: { type: "number" } },
      required: ["volumeIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "firstFlow",
          label: "First Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondFlow",
          label: "Second Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeIncrement",
          label: "Volume Increment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = flowVolumeIntegrationStepTool.execute;
export default flowVolumeIntegrationStepTool;
