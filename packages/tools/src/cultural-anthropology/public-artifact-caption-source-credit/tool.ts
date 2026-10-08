import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly captionText: string;
  readonly creditText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    captionText: { type: "string", maxLength: 8192, minLength: 1 },
    creditText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectId", "captionText", "creditText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit public artifact caption and supplied source credit without inferring rights or cultural authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, captionText, creditText } = request;
  const compute = (): Output => {
    H.domain(objectId.length > 0, "objectId");
    H.domain(captionText.length > 0, "captionText");
    H.domain(creditText.length > 0, "creditText");
    return { token: JSON.stringify([objectId, captionText, creditText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectId: "O17",
    captionText: "Woven basket",
    creditText: "community archive A",
  },
  output: { token: '["O17","Woven basket","community archive A"]' },
} satisfies ToolExample<Input, Output>;
export const publicArtifactCaptionSourceCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/public-artifact-caption-source-credit",
    title: "Public Artifact Caption Source Credit Tool",
    description:
      "Preserve an explicit public artifact caption and supplied source credit without inferring rights or cultural authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectId: { type: "string", maxLength: 8192, minLength: 1 },
        captionText: { type: "string", maxLength: 8192, minLength: 1 },
        creditText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["objectId", "captionText", "creditText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "objectId",
          label: "Object Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "captionText",
          label: "Caption Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "creditText",
          label: "Credit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicArtifactCaptionSourceCreditTool.execute;
export default publicArtifactCaptionSourceCreditTool;
