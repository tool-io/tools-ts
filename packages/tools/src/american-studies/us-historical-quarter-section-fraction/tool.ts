import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentArea: number;
  readonly quarterSteps: number;
  readonly retainedFraction: number;
};
export type Output = {
  readonly nominalArea: number;
  readonly retainedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentArea: { type: "number", minimum: 0 },
    quarterSteps: { type: "integer", minimum: 0, maximum: 128 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["parentArea", "quarterSteps", "retainedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalArea: { type: "number" },
    retainedArea: { type: "number" },
  },
  required: ["nominalArea", "retainedArea"],
} as const;
/** Arithmetic repeated quartering of a caller-supplied parent area, not a surveyed parcel boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentArea, quarterSteps, retainedFraction } = request;
  const compute = (): Output => {
    H.domain(parentArea >= 0);
    H.integer(quarterSteps, 0, 128);
    H.probability(retainedFraction);
    return {
      nominalArea: parentArea / 4 ** quarterSteps,
      retainedArea: (parentArea * retainedFraction) / 4 ** quarterSteps,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentArea: 640, quarterSteps: 2, retainedFraction: 1 },
  output: { nominalArea: 40, retainedArea: 40 },
} satisfies ToolExample<Input, Output>;
export const usHistoricalQuarterSectionFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/us-historical-quarter-section-fraction",
    title: "Us Historical Quarter Section Fraction Tool",
    description:
      "Arithmetic repeated quartering of a caller-supplied parent area, not a surveyed parcel boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentArea: { type: "number", minimum: 0 },
        quarterSteps: { type: "integer", minimum: 0, maximum: 128 },
        retainedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["parentArea", "quarterSteps", "retainedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalArea: { type: "number" },
        retainedArea: { type: "number" },
      },
      required: ["nominalArea", "retainedArea"],
    },
    ports: {
      inputs: [
        {
          id: "parentArea",
          label: "Parent Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quarterSteps",
          label: "Quarter Steps",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "nominalArea",
          label: "Nominal Area",
          valueType: { type: "number" },
        },
        {
          id: "retainedArea",
          label: "Retained Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = usHistoricalQuarterSectionFractionTool.execute;
export default usHistoricalQuarterSectionFractionTool;
