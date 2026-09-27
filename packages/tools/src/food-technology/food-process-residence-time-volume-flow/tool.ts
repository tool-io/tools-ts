import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workingVolume: number;
  readonly volumetricFlow: number;
  readonly bypassFraction: number;
};
export type Output = {
  readonly nominalTime: number;
  readonly activeFlow: number;
  readonly activeTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workingVolume: { type: "number", minimum: 0 },
    volumetricFlow: { type: "number", exclusiveMinimum: 0 },
    bypassFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["workingVolume", "volumetricFlow", "bypassFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalTime: { type: "number" },
    activeFlow: { type: "number" },
    activeTime: { type: "number" },
  },
  required: ["nominalTime", "activeFlow", "activeTime"],
} as const;
/** Ideal mixed-volume arithmetic; no residence-time distribution or process adequacy claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workingVolume, volumetricFlow, bypassFraction } = request;
  const compute = (): Output => {
    H.domain(workingVolume >= 0 && bypassFraction >= 0 && bypassFraction < 1);
    H.positive(volumetricFlow);
    return {
      nominalTime: workingVolume / volumetricFlow,
      activeFlow: volumetricFlow * (1 - bypassFraction),
      activeTime: workingVolume / (volumetricFlow * (1 - bypassFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workingVolume: 100, volumetricFlow: 10, bypassFraction: 0.2 },
  output: { nominalTime: 10, activeFlow: 8, activeTime: 12.5 },
} satisfies ToolExample<Input, Output>;
export const foodProcessResidenceTimeVolumeFlowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/food-process-residence-time-volume-flow",
    title: "Food Process Residence Time Volume Flow Tool",
    description:
      "Ideal mixed-volume arithmetic; no residence-time distribution or process adequacy claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workingVolume: { type: "number", minimum: 0 },
        volumetricFlow: { type: "number", exclusiveMinimum: 0 },
        bypassFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["workingVolume", "volumetricFlow", "bypassFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalTime: { type: "number" },
        activeFlow: { type: "number" },
        activeTime: { type: "number" },
      },
      required: ["nominalTime", "activeFlow", "activeTime"],
    },
    ports: {
      inputs: [
        {
          id: "workingVolume",
          label: "Working Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volumetricFlow",
          label: "Volumetric Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bypassFraction",
          label: "Bypass Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "nominalTime",
          label: "Nominal Time",
          valueType: { type: "number" },
        },
        {
          id: "activeFlow",
          label: "Active Flow",
          valueType: { type: "number" },
        },
        {
          id: "activeTime",
          label: "Active Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodProcessResidenceTimeVolumeFlowTool.execute;
export default foodProcessResidenceTimeVolumeFlowTool;
