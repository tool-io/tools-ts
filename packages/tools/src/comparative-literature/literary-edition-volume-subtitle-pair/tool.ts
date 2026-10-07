import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly editionId: string;
  readonly volumeLabel: string;
  readonly subtitle: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    volumeLabel: { type: "string", maxLength: 8192, minLength: 1 },
    subtitle: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["editionId", "volumeLabel", "subtitle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode a supplied edition, volume and subtitle as an ordered JSON record without interpreting volume notation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { editionId, volumeLabel, subtitle } = request;
  const compute = (): Output => {
    H.domain(editionId.length > 0, "editionId");
    H.domain(volumeLabel.length > 0, "volumeLabel");
    H.domain(subtitle.length > 0, "subtitle");
    return { token: JSON.stringify([editionId, volumeLabel, subtitle]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { editionId: "E17", volumeLabel: "II", subtitle: "The Return" },
  output: { token: '["E17","II","The Return"]' },
} satisfies ToolExample<Input, Output>;
export const literaryEditionVolumeSubtitlePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/literary-edition-volume-subtitle-pair",
    title: "Literary Edition Volume Subtitle Pair",
    description:
      "Encode a supplied edition, volume and subtitle as an ordered JSON record without interpreting volume notation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionId: { type: "string", maxLength: 8192, minLength: 1 },
        volumeLabel: { type: "string", maxLength: 8192, minLength: 1 },
        subtitle: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["editionId", "volumeLabel", "subtitle"],
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
          id: "editionId",
          label: "Edition Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "volumeLabel",
          label: "Volume Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "subtitle",
          label: "Subtitle",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = literaryEditionVolumeSubtitlePairTool.execute;
export default literaryEditionVolumeSubtitlePairTool;
