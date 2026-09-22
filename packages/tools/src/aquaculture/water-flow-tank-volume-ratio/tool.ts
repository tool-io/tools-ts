import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowVolumePerTime: number;
  readonly workingTankVolume: number;
  readonly bypassFraction: number;
};
export type Output = {
  readonly effectiveFlow: number;
  readonly turnoverRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowVolumePerTime: { type: "number", minimum: 0 },
    workingTankVolume: { type: "number", exclusiveMinimum: 0 },
    bypassFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["flowVolumePerTime", "workingTankVolume", "bypassFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveFlow: { type: "number" },
    turnoverRate: { type: "number" },
  },
  required: ["effectiveFlow", "turnoverRate"],
} as const;
/** Report a supplied working-volume turnover term after explicit bypass, without husbandry recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowVolumePerTime, workingTankVolume, bypassFraction } = request;
  const compute = (): Output => {
    H.domain(flowVolumePerTime >= 0);
    H.positive(workingTankVolume);
    H.probability(bypassFraction);
    return {
      effectiveFlow: flowVolumePerTime * (1 - bypassFraction),
      turnoverRate:
        (flowVolumePerTime / workingTankVolume) * (1 - bypassFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowVolumePerTime: 12, workingTankVolume: 30, bypassFraction: 0.25 },
  output: { effectiveFlow: 9, turnoverRate: 0.30000000000000004 },
} satisfies ToolExample<Input, Output>;
export const waterFlowTankVolumeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/water-flow-tank-volume-ratio",
    title: "Water Flow Tank Volume Ratio Tool",
    description:
      "Report a supplied working-volume turnover term after explicit bypass, without husbandry recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowVolumePerTime: { type: "number", minimum: 0 },
        workingTankVolume: { type: "number", exclusiveMinimum: 0 },
        bypassFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["flowVolumePerTime", "workingTankVolume", "bypassFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveFlow: { type: "number" },
        turnoverRate: { type: "number" },
      },
      required: ["effectiveFlow", "turnoverRate"],
    },
    ports: {
      inputs: [
        {
          id: "flowVolumePerTime",
          label: "Flow Volume Per Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "workingTankVolume",
          label: "Working Tank Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bypassFraction",
          label: "Bypass Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveFlow",
          label: "Effective Flow",
          valueType: { type: "number" },
        },
        {
          id: "turnoverRate",
          label: "Turnover Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterFlowTankVolumeRatioTool.execute;
export default waterFlowTankVolumeRatioTool;
