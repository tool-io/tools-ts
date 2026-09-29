import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineVolume: number;
  readonly throughFlow: number;
  readonly deadVolume: number;
};
export type Output = {
  readonly nominalTime: number;
  readonly activeVolumeTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineVolume: { type: "number" },
    throughFlow: { type: "number", exclusiveMinimum: 0 },
    deadVolume: { type: "number", minimum: 0 },
  },
  required: ["lineVolume", "throughFlow", "deadVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalTime: { type: "number" },
    activeVolumeTime: { type: "number" },
  },
  required: ["nominalTime", "activeVolumeTime"],
} as const;
/** Calculate hydroponic line residence time factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineVolume, throughFlow, deadVolume } = request;
  const compute = (): Output => {
    H.positive(throughFlow);
    H.domain(lineVolume >= deadVolume && deadVolume >= 0);
    return {
      nominalTime: lineVolume / throughFlow,
      activeVolumeTime: (lineVolume - deadVolume) / throughFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineVolume: 20, throughFlow: 5, deadVolume: 2 },
  output: { nominalTime: 4, activeVolumeTime: 3.6 },
} satisfies ToolExample<Input, Output>;
export const hydroponicLineResidenceTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/hydroponic-line-residence-time-factor",
    title: "Hydroponic Line Residence Time Factor Tool",
    description:
      "Calculate hydroponic line residence time factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineVolume: { type: "number" },
        throughFlow: { type: "number", exclusiveMinimum: 0 },
        deadVolume: { type: "number", minimum: 0 },
      },
      required: ["lineVolume", "throughFlow", "deadVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalTime: { type: "number" },
        activeVolumeTime: { type: "number" },
      },
      required: ["nominalTime", "activeVolumeTime"],
    },
    ports: {
      inputs: [
        {
          id: "lineVolume",
          label: "Line Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "throughFlow",
          label: "Through Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deadVolume",
          label: "Dead Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalTime",
          label: "Nominal Time",
          valueType: { type: "number" },
        },
        {
          id: "activeVolumeTime",
          label: "Active Volume Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydroponicLineResidenceTimeFactorTool.execute;
export default hydroponicLineResidenceTimeFactorTool;
