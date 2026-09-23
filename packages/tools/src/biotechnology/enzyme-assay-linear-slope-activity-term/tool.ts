import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signalSlope: number;
  readonly blankSlope: number;
  readonly reactionVolume: number;
  readonly conversionFactor: number;
};
export type Output = { readonly activity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signalSlope: { type: "number" },
    blankSlope: { type: "number" },
    reactionVolume: { type: "number", minimum: 0 },
    conversionFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["signalSlope", "blankSlope", "reactionVolume", "conversionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activity: { type: "number" } },
  required: ["activity"],
} as const;
/** Convert a blank-corrected linear assay slope with an explicit signal-to-amount factor in compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signalSlope, blankSlope, reactionVolume, conversionFactor } = request;
  const compute = (): Output => {
    H.domain(reactionVolume >= 0);
    H.positive(conversionFactor);
    return {
      activity: (signalSlope - blankSlope) * reactionVolume * conversionFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signalSlope: 0.5,
    blankSlope: 0.1,
    reactionVolume: 2,
    conversionFactor: 100,
  },
  output: { activity: 80 },
} satisfies ToolExample<Input, Output>;
export const enzymeAssayLinearSlopeActivityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/enzyme-assay-linear-slope-activity-term",
    title: "Enzyme Assay Linear Slope Activity Term Tool",
    description:
      "Convert a blank-corrected linear assay slope with an explicit signal-to-amount factor in compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signalSlope: { type: "number" },
        blankSlope: { type: "number" },
        reactionVolume: { type: "number", minimum: 0 },
        conversionFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "signalSlope",
        "blankSlope",
        "reactionVolume",
        "conversionFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { activity: { type: "number" } },
      required: ["activity"],
    },
    ports: {
      inputs: [
        {
          id: "signalSlope",
          label: "Signal Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankSlope",
          label: "Blank Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reactionVolume",
          label: "Reaction Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conversionFactor",
          label: "Conversion Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "activity", label: "Activity", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = enzymeAssayLinearSlopeActivityTermTool.execute;
export default enzymeAssayLinearSlopeActivityTermTool;
