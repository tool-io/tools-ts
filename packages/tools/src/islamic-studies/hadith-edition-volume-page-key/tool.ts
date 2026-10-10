import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly editionId: string;
  readonly volumeText: string;
  readonly pageText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    volumeText: { type: "string", maxLength: 8192, minLength: 1 },
    pageText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["workId", "editionId", "volumeText", "pageText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an exact edition-qualified hadith volume/page reference without asserting authenticity or cross-edition equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, editionId, volumeText, pageText } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0, "workId");
    H.domain(editionId.length > 0, "editionId");
    H.domain(volumeText.length > 0, "volumeText");
    H.domain(pageText.length > 0, "pageText");
    return { token: JSON.stringify([workId, editionId, volumeText, pageText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workId: "W17", editionId: "E4", volumeText: "II", pageText: "24" },
  output: { token: '["W17","E4","II","24"]' },
} satisfies ToolExample<Input, Output>;
export const hadithEditionVolumePageKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/hadith-edition-volume-page-key",
    title: "Hadith Edition Volume Page Key Tool",
    description:
      "Encode an exact edition-qualified hadith volume/page reference without asserting authenticity or cross-edition equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workId: { type: "string", maxLength: 8192, minLength: 1 },
        editionId: { type: "string", maxLength: 8192, minLength: 1 },
        volumeText: { type: "string", maxLength: 8192, minLength: 1 },
        pageText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["workId", "editionId", "volumeText", "pageText"],
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
          id: "workId",
          label: "Work Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "editionId",
          label: "Edition Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "volumeText",
          label: "Volume Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pageText",
          label: "Page Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hadithEditionVolumePageKeyTool.execute;
export default hadithEditionVolumePageKeyTool;
