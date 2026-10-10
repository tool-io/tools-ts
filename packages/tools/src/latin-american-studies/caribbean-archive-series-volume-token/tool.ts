import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archiveId: string;
  readonly seriesText: string;
  readonly volumeText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archiveId: { type: "string", maxLength: 8192, minLength: 1 },
    seriesText: { type: "string", maxLength: 8192, minLength: 1 },
    volumeText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["archiveId", "seriesText", "volumeText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit Caribbean archive series-volume locator without accessing records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archiveId, seriesText, volumeText } = request;
  const compute = (): Output => {
    H.domain(archiveId.length > 0, "archiveId");
    H.domain(seriesText.length > 0, "seriesText");
    H.domain(volumeText.length > 0, "volumeText");
    return { token: JSON.stringify([archiveId, seriesText, volumeText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { archiveId: "AR17", seriesText: "SER2", volumeText: "Vol. 3" },
  output: { token: '["AR17","SER2","Vol. 3"]' },
} satisfies ToolExample<Input, Output>;
export const caribbeanArchiveSeriesVolumeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "latin-american-studies",
        "latin american studies",
        "humanities",
      ],
      keywords: ["latin american studies", "humanities"],
    },
    id: "latin-american-studies/caribbean-archive-series-volume-token",
    title: "Caribbean Archive Series Volume Token",
    description:
      "Qualify an explicit Caribbean archive series-volume locator without accessing records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        archiveId: { type: "string", maxLength: 8192, minLength: 1 },
        seriesText: { type: "string", maxLength: 8192, minLength: 1 },
        volumeText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["archiveId", "seriesText", "volumeText"],
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
          id: "archiveId",
          label: "Archive Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seriesText",
          label: "Series Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "volumeText",
          label: "Volume Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = caribbeanArchiveSeriesVolumeTokenTool.execute;
export default caribbeanArchiveSeriesVolumeTokenTool;
