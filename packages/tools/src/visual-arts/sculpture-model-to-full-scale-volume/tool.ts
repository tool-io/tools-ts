import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelVolume: number;
  readonly fullSizePerModelLengthRatio: number;
};
export type Output = { readonly fullSizeVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelVolume: { type: "number", minimum: 0 },
    fullSizePerModelLengthRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["modelVolume", "fullSizePerModelLengthRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fullSizeVolume: { type: "number" } },
  required: ["fullSizeVolume"],
} as const;
/** Scale an explicit sculpture model volume by the cube of a supplied uniform length ratio without assuming mass or material similarity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelVolume, fullSizePerModelLengthRatio } = request;
  const compute = (): Output => {
    H.domain(modelVolume >= 0, "modelVolume");
    (H.domain(
      Number.isFinite(fullSizePerModelLengthRatio) &&
        fullSizePerModelLengthRatio > 0,
      "fullSizePerModelLengthRatio",
    ),
      fullSizePerModelLengthRatio);
    return {
      fullSizeVolume: modelVolume * Math.pow(fullSizePerModelLengthRatio, 3),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modelVolume: 2, fullSizePerModelLengthRatio: 5 },
  output: { fullSizeVolume: 250 },
} satisfies ToolExample<Input, Output>;
export const sculptureModelToFullScaleVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["visual-arts", "visual arts", "arts and design"],
      keywords: ["visual arts", "arts and design"],
    },
    id: "visual-arts/sculpture-model-to-full-scale-volume",
    title: "Sculpture Model To Full Scale Volume",
    description:
      "Scale an explicit sculpture model volume by the cube of a supplied uniform length ratio without assuming mass or material similarity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelVolume: { type: "number", minimum: 0 },
        fullSizePerModelLengthRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["modelVolume", "fullSizePerModelLengthRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fullSizeVolume: { type: "number" } },
      required: ["fullSizeVolume"],
    },
    ports: {
      inputs: [
        {
          id: "modelVolume",
          label: "Model Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullSizePerModelLengthRatio",
          label: "Full Size Per Model Length Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fullSizeVolume",
          label: "Full Size Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sculptureModelToFullScaleVolumeTool.execute;
export default sculptureModelToFullScaleVolumeTool;
