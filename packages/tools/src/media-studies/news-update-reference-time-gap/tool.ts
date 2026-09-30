import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publishedAt: number;
  readonly correctedAt: number;
  readonly referenceAt: number;
};
export type Output = {
  readonly publicationAge: number;
  readonly correctionLag: number;
  readonly correctionAge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publishedAt: { type: "number" },
    correctedAt: { type: "number" },
    referenceAt: { type: "number" },
  },
  required: ["publishedAt", "correctedAt", "referenceAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationAge: { type: "number" },
    correctionLag: { type: "number" },
    correctionAge: { type: "number" },
  },
  required: ["publicationAge", "correctionLag", "correctionAge"],
} as const;
/** Compare explicitly supplied publication, correction and reference clocks without fetching news. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publishedAt, correctedAt, referenceAt } = request;
  const compute = (): Output => {
    H.domain(correctedAt >= publishedAt);
    return {
      publicationAge: referenceAt - publishedAt,
      correctionLag: correctedAt - publishedAt,
      correctionAge: referenceAt - correctedAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { publishedAt: 10, correctedAt: 12, referenceAt: 20 },
  output: { publicationAge: 10, correctionLag: 2, correctionAge: 8 },
} satisfies ToolExample<Input, Output>;
export const newsUpdateReferenceTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/news-update-reference-time-gap",
    title: "News Update Reference Time Gap Tool",
    description:
      "Compare explicitly supplied publication, correction and reference clocks without fetching news.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publishedAt: { type: "number" },
        correctedAt: { type: "number" },
        referenceAt: { type: "number" },
      },
      required: ["publishedAt", "correctedAt", "referenceAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publicationAge: { type: "number" },
        correctionLag: { type: "number" },
        correctionAge: { type: "number" },
      },
      required: ["publicationAge", "correctionLag", "correctionAge"],
    },
    ports: {
      inputs: [
        {
          id: "publishedAt",
          label: "Published At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correctedAt",
          label: "Corrected At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAt",
          label: "Reference At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "publicationAge",
          label: "Publication Age",
          valueType: { type: "number" },
        },
        {
          id: "correctionLag",
          label: "Correction Lag",
          valueType: { type: "number" },
        },
        {
          id: "correctionAge",
          label: "Correction Age",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = newsUpdateReferenceTimeGapTool.execute;
export default newsUpdateReferenceTimeGapTool;
