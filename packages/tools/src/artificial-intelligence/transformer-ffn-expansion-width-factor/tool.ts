import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelWidth: number;
  readonly expansion: number;
  readonly alignment: number;
};
export type Output = {
  readonly rawWidth: number;
  readonly alignedWidth: number;
  readonly actualExpansion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelWidth: { type: "integer", minimum: 1 },
    expansion: { type: "number", exclusiveMinimum: 0 },
    alignment: { type: "integer", minimum: 1 },
  },
  required: ["modelWidth", "expansion", "alignment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawWidth: { type: "number" },
    alignedWidth: { type: "integer" },
    actualExpansion: { type: "number" },
  },
  required: ["rawWidth", "alignedWidth", "actualExpansion"],
} as const;
/** Calculate transformer ffn expansion width factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelWidth, expansion, alignment } = request;
  const compute = (): Output => {
    H.integer(modelWidth, 1);
    H.positive(expansion);
    H.integer(alignment, 1);
    return {
      rawWidth: modelWidth * expansion,
      alignedWidth: Math.ceil((modelWidth * expansion) / alignment) * alignment,
      actualExpansion:
        (Math.ceil((modelWidth * expansion) / alignment) * alignment) /
        modelWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modelWidth: 128, expansion: 4, alignment: 64 },
  output: { rawWidth: 512, alignedWidth: 512, actualExpansion: 4 },
} satisfies ToolExample<Input, Output>;
export const transformerFfnExpansionWidthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/transformer-ffn-expansion-width-factor",
    title: "Transformer Ffn Expansion Width Factor Tool",
    description:
      "Calculate transformer ffn expansion width factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelWidth: { type: "integer", minimum: 1 },
        expansion: { type: "number", exclusiveMinimum: 0 },
        alignment: { type: "integer", minimum: 1 },
      },
      required: ["modelWidth", "expansion", "alignment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawWidth: { type: "number" },
        alignedWidth: { type: "integer" },
        actualExpansion: { type: "number" },
      },
      required: ["rawWidth", "alignedWidth", "actualExpansion"],
    },
    ports: {
      inputs: [
        {
          id: "modelWidth",
          label: "Model Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expansion",
          label: "Expansion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alignment",
          label: "Alignment",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "rawWidth", label: "Raw Width", valueType: { type: "number" } },
        {
          id: "alignedWidth",
          label: "Aligned Width",
          valueType: { type: "integer" },
        },
        {
          id: "actualExpansion",
          label: "Actual Expansion",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = transformerFfnExpansionWidthFactorTool.execute;
export default transformerFfnExpansionWidthFactorTool;
