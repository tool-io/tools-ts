import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commandValue: number;
  readonly measuredValue: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commandValue: { type: "number" },
    measuredValue: { type: "number" },
  },
  required: ["commandValue", "measuredValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate measured-minus-command actuator residual in an explicit shared reference frame and unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commandValue, measuredValue } = request;
  const compute = (): Output => {
    return { signedGap: measuredValue - commandValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commandValue: 12, measuredValue: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const actuatorCommandMeasurementResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/actuator-command-measurement-residual",
    title: "Actuator Command Measurement Residual Tool",
    description:
      "Calculate measured-minus-command actuator residual in an explicit shared reference frame and unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commandValue: { type: "number" },
        measuredValue: { type: "number" },
      },
      required: ["commandValue", "measuredValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "commandValue",
          label: "Command Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredValue",
          label: "Measured Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = actuatorCommandMeasurementResidualTool.execute;
export default actuatorCommandMeasurementResidualTool;
