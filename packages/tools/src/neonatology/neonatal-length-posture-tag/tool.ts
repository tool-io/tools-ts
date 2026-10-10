import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurementId: string;
  readonly postureWording: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementId: { type: "string", maxLength: 8192, minLength: 1 },
    postureWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["measurementId", "postureWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label explicitly recorded neonatal length-measurement posture without adjusting measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurementId, postureWording } = request;
  const compute = (): Output => {
    H.domain(
      measurementId.length > 0 && postureWording.length > 0,
      "measurementId",
    );
    return { tag: measurementId + " [" + postureWording + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measurementId: "M17", postureWording: "recumbent" },
  output: { tag: "M17 [recumbent]" },
} satisfies ToolExample<Input, Output>;
export const neonatalLengthPostureTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/neonatal-length-posture-tag",
    title: "Neonatal Length Posture Tag",
    description:
      "Label explicitly recorded neonatal length-measurement posture without adjusting measurements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measurementId: { type: "string", maxLength: 8192, minLength: 1 },
        postureWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["measurementId", "postureWording"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "measurementId",
          label: "Measurement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "postureWording",
          label: "Posture Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = neonatalLengthPostureTagTool.execute;
export default neonatalLengthPostureTagTool;
