import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedOutput: number;
  readonly lowerLimit: number;
  readonly upperLimit: number;
};
export type Output = {
  readonly appliedOutput: number;
  readonly unappliedResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedOutput: { type: "number" },
    lowerLimit: { type: "number" },
    upperLimit: { type: "number" },
  },
  required: ["requestedOutput", "lowerLimit", "upperLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appliedOutput: { type: "number" },
    unappliedResidual: { type: "number" },
  },
  required: ["appliedOutput", "unappliedResidual"],
} as const;
/** Clamp an explicit actuator request to supplied inclusive limits and report requested-minus-applied residual. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedOutput, lowerLimit, upperLimit } = request;
  const compute = (): Output => {
    H.domain(lowerLimit <= upperLimit, "lowerLimit");
    return (() => {
      const appliedOutput = Math.max(
        lowerLimit,
        Math.min(upperLimit, requestedOutput),
      );
      return {
        appliedOutput,
        unappliedResidual: requestedOutput - appliedOutput,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedOutput: 12, lowerLimit: 0, upperLimit: 10 },
  output: { appliedOutput: 10, unappliedResidual: 2 },
} satisfies ToolExample<Input, Output>;
export const actuatorSaturationResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cybernetics", "engineering"],
      keywords: ["cybernetics", "engineering"],
    },
    id: "cybernetics/actuator-saturation-residual",
    title: "Actuator Saturation Residual",
    description:
      "Clamp an explicit actuator request to supplied inclusive limits and report requested-minus-applied residual.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedOutput: { type: "number" },
        lowerLimit: { type: "number" },
        upperLimit: { type: "number" },
      },
      required: ["requestedOutput", "lowerLimit", "upperLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appliedOutput: { type: "number" },
        unappliedResidual: { type: "number" },
      },
      required: ["appliedOutput", "unappliedResidual"],
    },
    ports: {
      inputs: [
        {
          id: "requestedOutput",
          label: "Requested Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerLimit",
          label: "Lower Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperLimit",
          label: "Upper Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "appliedOutput",
          label: "Applied Output",
          valueType: { type: "number" },
        },
        {
          id: "unappliedResidual",
          label: "Unapplied Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = actuatorSaturationResidualTool.execute;
export default actuatorSaturationResidualTool;
