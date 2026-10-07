import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly jointPower: number; readonly bodyMass: number };
export type Output = { readonly powerPerMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointPower: { type: "number" },
    bodyMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["jointPower", "bodyMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { powerPerMass: { type: "number" } },
  required: ["powerPerMass"],
} as const;
/** Normalize supplied signed joint power by positive body mass without assessing movement quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointPower, bodyMass } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(bodyMass) && bodyMass > 0, "bodyMass"), bodyMass);
    return { powerPerMass: jointPower / bodyMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jointPower: 140, bodyMass: 70 },
  output: { powerPerMass: 2 },
} satisfies ToolExample<Input, Output>;
export const jointPowerNormalizationMassfactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/joint-power-normalization-mass-factor",
    title: "Joint Power Normalization Mass Factor",
    description:
      "Normalize supplied signed joint power by positive body mass without assessing movement quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointPower: { type: "number" },
        bodyMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["jointPower", "bodyMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { powerPerMass: { type: "number" } },
      required: ["powerPerMass"],
    },
    ports: {
      inputs: [
        {
          id: "jointPower",
          label: "Joint Power",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bodyMass",
          label: "Body Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "powerPerMass",
          label: "Power Per Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = jointPowerNormalizationMassfactorTool.execute;
export default jointPowerNormalizationMassfactorTool;
