import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredScanLength: number;
  readonly knownReferenceLength: number;
};
export type Output = { readonly referencePerScanFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredScanLength: { type: "number", exclusiveMinimum: 0 },
    knownReferenceLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredScanLength", "knownReferenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencePerScanFactor: { type: "number" } },
  required: ["referencePerScanFactor"],
} as const;
/** Calculate an explicit model-scan length scale factor without correcting shape distortion or determining scanner accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredScanLength, knownReferenceLength } = request;
  const compute = (): Output => {
    (H.domain(measuredScanLength > 0, "measuredScanLength"),
      measuredScanLength);
    (H.domain(knownReferenceLength > 0, "knownReferenceLength"),
      knownReferenceLength);
    return {
      referencePerScanFactor: knownReferenceLength / measuredScanLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredScanLength: 50, knownReferenceLength: 100 },
  output: { referencePerScanFactor: 2 },
} satisfies ToolExample<Input, Output>;
export const modelScanScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthodontics", "health and medicine"],
      keywords: ["orthodontics", "health and medicine"],
    },
    id: "orthodontics/model-scan-scale-factor",
    title: "Model Scan Scale Factor",
    description:
      "Calculate an explicit model-scan length scale factor without correcting shape distortion or determining scanner accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredScanLength: { type: "number", exclusiveMinimum: 0 },
        knownReferenceLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredScanLength", "knownReferenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referencePerScanFactor: { type: "number" } },
      required: ["referencePerScanFactor"],
    },
    ports: {
      inputs: [
        {
          id: "measuredScanLength",
          label: "Measured Scan Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "knownReferenceLength",
          label: "Known Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referencePerScanFactor",
          label: "Reference Per Scan Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = modelScanScaleFactorTool.execute;
export default modelScanScaleFactorTool;
