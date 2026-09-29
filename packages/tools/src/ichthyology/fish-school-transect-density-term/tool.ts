import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fish: number;
  readonly transectLength: number;
  readonly stripWidth: number;
  readonly detectionFraction: number;
};
export type Output = {
  readonly sampledArea: number;
  readonly observedDensity: number;
  readonly adjustedDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fish: { type: "integer", minimum: 0 },
    transectLength: { type: "number", exclusiveMinimum: 0 },
    stripWidth: { type: "number", exclusiveMinimum: 0 },
    detectionFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["fish", "transectLength", "stripWidth", "detectionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampledArea: { type: "number" },
    observedDensity: { type: "number" },
    adjustedDensity: { type: "number" },
  },
  required: ["sampledArea", "observedDensity", "adjustedDensity"],
} as const;
/** Strip-area density with an explicitly supplied detection correction, without estimating school geometry or detectability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fish, transectLength, stripWidth, detectionFraction } = request;
  const compute = (): Output => {
    H.integer(fish, 0);
    H.positive(transectLength);
    H.positive(stripWidth);
    H.domain(detectionFraction > 0 && detectionFraction <= 1);
    return {
      sampledArea: transectLength * stripWidth,
      observedDensity: fish / (transectLength * stripWidth),
      adjustedDensity: fish / (transectLength * stripWidth * detectionFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fish: 100,
    transectLength: 50,
    stripWidth: 2,
    detectionFraction: 0.5,
  },
  output: { sampledArea: 100, observedDensity: 1, adjustedDensity: 2 },
} satisfies ToolExample<Input, Output>;
export const fishSchoolTransectDensityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-school-transect-density-term",
    title: "Fish School Transect Density Term Tool",
    description:
      "Strip-area density with an explicitly supplied detection correction, without estimating school geometry or detectability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fish: { type: "integer", minimum: 0 },
        transectLength: { type: "number", exclusiveMinimum: 0 },
        stripWidth: { type: "number", exclusiveMinimum: 0 },
        detectionFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["fish", "transectLength", "stripWidth", "detectionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampledArea: { type: "number" },
        observedDensity: { type: "number" },
        adjustedDensity: { type: "number" },
      },
      required: ["sampledArea", "observedDensity", "adjustedDensity"],
    },
    ports: {
      inputs: [
        {
          id: "fish",
          label: "Fish",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transectLength",
          label: "Transect Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stripWidth",
          label: "Strip Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "detectionFraction",
          label: "Detection Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampledArea",
          label: "Sampled Area",
          valueType: { type: "number" },
        },
        {
          id: "observedDensity",
          label: "Observed Density",
          valueType: { type: "number" },
        },
        {
          id: "adjustedDensity",
          label: "Adjusted Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishSchoolTransectDensityTermTool.execute;
export default fishSchoolTransectDensityTermTool;
