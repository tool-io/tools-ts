import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deploymentDays: number;
  readonly inactiveDays: number;
};
export type Output = { readonly activeDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deploymentDays: { type: "number", minimum: 0 },
    inactiveDays: { type: "number", minimum: 0 },
  },
  required: ["deploymentDays", "inactiveDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activeDays: { type: "number" } },
  required: ["activeDays"],
} as const;
/** Subtract explicitly recorded inactive camera-trap days from deployed duration without estimating detection probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deploymentDays, inactiveDays } = request;
  const compute = (): Output => {
    H.domain(deploymentDays >= 0, "deploymentDays");
    H.domain(
      inactiveDays >= 0 && inactiveDays <= deploymentDays,
      "inactiveDays",
    );
    return { activeDays: deploymentDays - inactiveDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deploymentDays: 30, inactiveDays: 4 },
  output: { activeDays: 26 },
} satisfies ToolExample<Input, Output>;
export const cameraTrapDeploymentGapExposureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/camera-trap-deployment-gap-exposure",
    title: "Camera Trap Deployment Gap Exposure",
    description:
      "Subtract explicitly recorded inactive camera-trap days from deployed duration without estimating detection probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deploymentDays: { type: "number", minimum: 0 },
        inactiveDays: { type: "number", minimum: 0 },
      },
      required: ["deploymentDays", "inactiveDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { activeDays: { type: "number" } },
      required: ["activeDays"],
    },
    ports: {
      inputs: [
        {
          id: "deploymentDays",
          label: "Deployment Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inactiveDays",
          label: "Inactive Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeDays",
          label: "Active Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cameraTrapDeploymentGapExposureTool.execute;
export default cameraTrapDeploymentGapExposureTool;
