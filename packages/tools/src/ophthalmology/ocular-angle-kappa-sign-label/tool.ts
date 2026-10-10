import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleDegrees: number;
  readonly positiveConvention: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleDegrees: { type: "number" },
    positiveConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["angleDegrees", "positiveConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied ocular angle and its explicit positive-sign convention without deriving an angle from anatomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleDegrees, positiveConvention } = request;
  const compute = (): Output => {
    H.domain(positiveConvention.length > 0, "positiveConvention");
    return { label: angleDegrees + "° [positive=" + positiveConvention + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleDegrees: 3, positiveConvention: "nasal reference A" },
  output: { label: "3° [positive=nasal reference A]" },
} satisfies ToolExample<Input, Output>;
export const ocularAngleKappaSignLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["ophthalmology", "health and medicine"],
      keywords: ["ophthalmology", "health and medicine"],
    },
    id: "ophthalmology/ocular-angle-kappa-sign-label",
    title: "Ocular Angle Kappa Sign Label",
    description:
      "Label a supplied ocular angle and its explicit positive-sign convention without deriving an angle from anatomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleDegrees: { type: "number" },
        positiveConvention: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["angleDegrees", "positiveConvention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveConvention",
          label: "Positive Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ocularAngleKappaSignLabelTool.execute;
export default ocularAngleKappaSignLabelTool;
