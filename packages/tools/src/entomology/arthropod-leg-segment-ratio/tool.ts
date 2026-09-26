import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly femur: number;
  readonly tibia: number;
  readonly tarsus: number;
};
export type Output = {
  readonly tibiaFemurRatio: number;
  readonly tarsusTibiaRatio: number;
  readonly distalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    femur: { type: "number", exclusiveMinimum: 0 },
    tibia: { type: "number", exclusiveMinimum: 0 },
    tarsus: { type: "number", minimum: 0 },
  },
  required: ["femur", "tibia", "tarsus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tibiaFemurRatio: { type: "number" },
    tarsusTibiaRatio: { type: "number" },
    distalFraction: { type: "number" },
  },
  required: ["tibiaFemurRatio", "tarsusTibiaRatio", "distalFraction"],
} as const;
/** Calculate arthropod leg segment ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { femur, tibia, tarsus } = request;
  const compute = (): Output => {
    H.positive(femur);
    H.positive(tibia);
    H.domain(tarsus >= 0);
    return {
      tibiaFemurRatio: tibia / femur,
      tarsusTibiaRatio: tarsus / tibia,
      distalFraction: tarsus / (femur + tibia + tarsus),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { femur: 4, tibia: 3, tarsus: 1 },
  output: {
    tibiaFemurRatio: 0.75,
    tarsusTibiaRatio: 0.3333333333333333,
    distalFraction: 0.125,
  },
} satisfies ToolExample<Input, Output>;
export const arthropodLegSegmentRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/arthropod-leg-segment-ratio",
    title: "Arthropod Leg Segment Ratio Tool",
    description:
      "Calculate arthropod leg segment ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        femur: { type: "number", exclusiveMinimum: 0 },
        tibia: { type: "number", exclusiveMinimum: 0 },
        tarsus: { type: "number", minimum: 0 },
      },
      required: ["femur", "tibia", "tarsus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tibiaFemurRatio: { type: "number" },
        tarsusTibiaRatio: { type: "number" },
        distalFraction: { type: "number" },
      },
      required: ["tibiaFemurRatio", "tarsusTibiaRatio", "distalFraction"],
    },
    ports: {
      inputs: [
        {
          id: "femur",
          label: "Femur",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tibia",
          label: "Tibia",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tarsus",
          label: "Tarsus",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tibiaFemurRatio",
          label: "Tibia Femur Ratio",
          valueType: { type: "number" },
        },
        {
          id: "tarsusTibiaRatio",
          label: "Tarsus Tibia Ratio",
          valueType: { type: "number" },
        },
        {
          id: "distalFraction",
          label: "Distal Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = arthropodLegSegmentRatioTool.execute;
export default arthropodLegSegmentRatioTool;
