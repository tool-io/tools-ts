import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly miniatureArea: number;
  readonly textArea: number;
  readonly pageArea: number;
};
export type Output = {
  readonly miniatureShare: number;
  readonly textShare: number;
  readonly unallocatedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    miniatureArea: { type: "number", minimum: 0 },
    textArea: { type: "number", minimum: 0 },
    pageArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["miniatureArea", "textArea", "pageArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    miniatureShare: { type: "number" },
    textShare: { type: "number" },
    unallocatedShare: { type: "number" },
  },
  required: ["miniatureShare", "textShare", "unallocatedShare"],
} as const;
/** Treat supplied miniature and text areas as disjoint. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { miniatureArea, textArea, pageArea } = request;
  const compute = (): Output => {
    H.positive(pageArea);
    H.domain(
      miniatureArea >= 0 &&
        textArea >= 0 &&
        miniatureArea + textArea <= pageArea,
    );
    return {
      miniatureShare: miniatureArea / pageArea,
      textShare: textArea / pageArea,
      unallocatedShare: 1 - (miniatureArea + textArea) / pageArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { miniatureArea: 20, textArea: 60, pageArea: 100 },
  output: {
    miniatureShare: 0.2,
    textShare: 0.6,
    unallocatedShare: 0.19999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const manuscriptMiniatureTextAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/manuscript-miniature-text-area-share",
    title: "Manuscript Miniature Text Area Share Tool",
    description: "Treat supplied miniature and text areas as disjoint.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        miniatureArea: { type: "number", minimum: 0 },
        textArea: { type: "number", minimum: 0 },
        pageArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["miniatureArea", "textArea", "pageArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        miniatureShare: { type: "number" },
        textShare: { type: "number" },
        unallocatedShare: { type: "number" },
      },
      required: ["miniatureShare", "textShare", "unallocatedShare"],
    },
    ports: {
      inputs: [
        {
          id: "miniatureArea",
          label: "Miniature Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "textArea",
          label: "Text Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pageArea",
          label: "Page Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "miniatureShare",
          label: "Miniature Share",
          valueType: { type: "number" },
        },
        { id: "textShare", label: "Text Share", valueType: { type: "number" } },
        {
          id: "unallocatedShare",
          label: "Unallocated Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = manuscriptMiniatureTextAreaShareTool.execute;
export default manuscriptMiniatureTextAreaShareTool;
