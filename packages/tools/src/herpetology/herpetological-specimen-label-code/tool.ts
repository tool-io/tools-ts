import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionCode: string;
  readonly specimenCode: string;
  readonly labelVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionCode: { type: "string", maxLength: 8192, minLength: 1 },
    specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
    labelVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["collectionCode", "specimenCode", "labelVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied herpetological specimen identifier by collection and label version. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionCode, specimenCode, labelVersion } = request;
  const compute = (): Output => {
    H.domain(collectionCode.length > 0, "collectionCode");
    H.domain(specimenCode.length > 0, "specimenCode");
    H.domain(labelVersion.length > 0, "labelVersion");
    return {
      token: JSON.stringify([collectionCode, specimenCode, labelVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectionCode: "COL-A", specimenCode: "H17", labelVersion: "v2" },
  output: { token: '["COL-A","H17","v2"]' },
} satisfies ToolExample<Input, Output>;
export const herpetologicalSpecimenLabelCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["herpetology", "biology"],
      keywords: ["herpetology", "biology"],
    },
    id: "herpetology/herpetological-specimen-label-code",
    title: "Herpetological Specimen Label Code",
    description:
      "Qualify a supplied herpetological specimen identifier by collection and label version.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionCode: { type: "string", maxLength: 8192, minLength: 1 },
        specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
        labelVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["collectionCode", "specimenCode", "labelVersion"],
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
          id: "collectionCode",
          label: "Collection Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "specimenCode",
          label: "Specimen Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelVersion",
          label: "Label Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = herpetologicalSpecimenLabelCodeTool.execute;
export default herpetologicalSpecimenLabelCodeTool;
