import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedLeverArmMeters: number;
  readonly forceNewtons: number;
};
export type Output = { readonly momentNewtonMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedLeverArmMeters: { type: "number" },
    forceNewtons: { type: "number" },
  },
  required: ["signedLeverArmMeters", "forceNewtons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { momentNewtonMeters: { type: "number" } },
  required: ["momentNewtonMeters"],
} as const;
/** Compute a signed planar moment from an explicitly signed perpendicular lever arm and compatible force. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedLeverArmMeters, forceNewtons } = request;
  const compute = (): Output => {
    return { momentNewtonMeters: signedLeverArmMeters * forceNewtons };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedLeverArmMeters: 0.05, forceNewtons: 200 },
  output: { momentNewtonMeters: 10 },
} satisfies ToolExample<Input, Output>;
export const leverArmMomentSignedProductTool = H.defineSchemaCalculation<
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
    id: "biomechanics/lever-arm-moment-signed-product",
    title: "Lever Arm Moment Signed Product",
    description:
      "Compute a signed planar moment from an explicitly signed perpendicular lever arm and compatible force.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedLeverArmMeters: { type: "number" },
        forceNewtons: { type: "number" },
      },
      required: ["signedLeverArmMeters", "forceNewtons"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { momentNewtonMeters: { type: "number" } },
      required: ["momentNewtonMeters"],
    },
    ports: {
      inputs: [
        {
          id: "signedLeverArmMeters",
          label: "Signed Lever Arm Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forceNewtons",
          label: "Force Newtons",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "momentNewtonMeters",
          label: "Moment Newton Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leverArmMomentSignedProductTool.execute;
export default leverArmMomentSignedProductTool;
