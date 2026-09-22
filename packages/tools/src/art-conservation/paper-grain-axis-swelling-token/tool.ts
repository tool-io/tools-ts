import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredAxis: string;
  readonly grainAxis: string;
  readonly alongFactor: number;
  readonly acrossFactor: number;
  readonly originalLength: number;
};
export type Output = {
  readonly relation: string;
  readonly predictedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredAxis: { type: "string", maxLength: 8192, enum: ["x", "y"] },
    grainAxis: { type: "string", maxLength: 8192, enum: ["x", "y"] },
    alongFactor: { type: "number", exclusiveMinimum: 0 },
    acrossFactor: { type: "number", exclusiveMinimum: 0 },
    originalLength: { type: "number", minimum: 0 },
  },
  required: [
    "measuredAxis",
    "grainAxis",
    "alongFactor",
    "acrossFactor",
    "originalLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relation: { type: "string", maxLength: 8192 },
    predictedLength: { type: "number" },
  },
  required: ["relation", "predictedLength"],
} as const;
/** Apply supplied directional swelling factors without inferring paper grain or material behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredAxis, grainAxis, alongFactor, acrossFactor, originalLength } =
    request;
  const compute = (): Output => {
    H.domain(
      ["x", "y"].includes(measuredAxis) &&
        ["x", "y"].includes(grainAxis) &&
        alongFactor > 0 &&
        acrossFactor > 0 &&
        originalLength >= 0,
    );
    const along = measuredAxis === grainAxis;
    return {
      relation: along ? "along" : "across",
      predictedLength: originalLength * (along ? alongFactor : acrossFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredAxis: "x",
    grainAxis: "y",
    alongFactor: 1.01,
    acrossFactor: 1.03,
    originalLength: 100,
  },
  output: { relation: "across", predictedLength: 103 },
} satisfies ToolExample<Input, Output>;
export const paperGrainAxisSwellingTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/paper-grain-axis-swelling-token",
    title: "Paper Grain Axis Swelling Token Tool",
    description:
      "Apply supplied directional swelling factors without inferring paper grain or material behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredAxis: { type: "string", maxLength: 8192, enum: ["x", "y"] },
        grainAxis: { type: "string", maxLength: 8192, enum: ["x", "y"] },
        alongFactor: { type: "number", exclusiveMinimum: 0 },
        acrossFactor: { type: "number", exclusiveMinimum: 0 },
        originalLength: { type: "number", minimum: 0 },
      },
      required: [
        "measuredAxis",
        "grainAxis",
        "alongFactor",
        "acrossFactor",
        "originalLength",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relation: { type: "string", maxLength: 8192 },
        predictedLength: { type: "number" },
      },
      required: ["relation", "predictedLength"],
    },
    ports: {
      inputs: [
        {
          id: "measuredAxis",
          label: "Measured Axis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "grainAxis",
          label: "Grain Axis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "alongFactor",
          label: "Along Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acrossFactor",
          label: "Across Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originalLength",
          label: "Original Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "relation", label: "Relation", valueType: { type: "string" } },
        {
          id: "predictedLength",
          label: "Predicted Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paperGrainAxisSwellingTokenTool.execute;
export default paperGrainAxisSwellingTokenTool;
