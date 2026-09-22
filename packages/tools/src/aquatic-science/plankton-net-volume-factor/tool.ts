import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mouthArea: number;
  readonly towDistance: number;
  readonly measuredFlowFactor: number;
  readonly efficiencyFraction: number;
};
export type Output = {
  readonly geometricVolume: number;
  readonly correctedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mouthArea: { type: "number", minimum: 0 },
    towDistance: { type: "number", minimum: 0 },
    measuredFlowFactor: { type: "number", minimum: 0 },
    efficiencyFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "mouthArea",
    "towDistance",
    "measuredFlowFactor",
    "efficiencyFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geometricVolume: { type: "number" },
    correctedVolume: { type: "number" },
  },
  required: ["geometricVolume", "correctedVolume"],
} as const;
/** Calculate plankton net volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mouthArea, towDistance, measuredFlowFactor, efficiencyFraction } =
    request;
  const compute = (): Output => {
    H.domain(mouthArea >= 0 && towDistance >= 0 && measuredFlowFactor >= 0);
    H.probability(efficiencyFraction);
    return {
      geometricVolume: mouthArea * towDistance,
      correctedVolume:
        mouthArea * towDistance * measuredFlowFactor * efficiencyFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mouthArea: 2,
    towDistance: 10,
    measuredFlowFactor: 0.8,
    efficiencyFraction: 0.5,
  },
  output: { geometricVolume: 20, correctedVolume: 8 },
} satisfies ToolExample<Input, Output>;
export const planktonNetVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/plankton-net-volume-factor",
    title: "Plankton Net Volume Factor Tool",
    description:
      "Calculate plankton net volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mouthArea: { type: "number", minimum: 0 },
        towDistance: { type: "number", minimum: 0 },
        measuredFlowFactor: { type: "number", minimum: 0 },
        efficiencyFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "mouthArea",
        "towDistance",
        "measuredFlowFactor",
        "efficiencyFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        geometricVolume: { type: "number" },
        correctedVolume: { type: "number" },
      },
      required: ["geometricVolume", "correctedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "mouthArea",
          label: "Mouth Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "towDistance",
          label: "Tow Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredFlowFactor",
          label: "Measured Flow Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "efficiencyFraction",
          label: "Efficiency Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "geometricVolume",
          label: "Geometric Volume",
          valueType: { type: "number" },
        },
        {
          id: "correctedVolume",
          label: "Corrected Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = planktonNetVolumeFactorTool.execute;
export default planktonNetVolumeFactorTool;
