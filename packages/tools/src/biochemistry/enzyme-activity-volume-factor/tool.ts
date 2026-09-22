import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityPerSourceVolume: number;
  readonly sourceVolume: number;
  readonly suppliedActivityUnitFactor: number;
};
export type Output = { readonly totalActivity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityPerSourceVolume: { type: "number" },
    sourceVolume: { type: "number", minimum: 0 },
    suppliedActivityUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "activityPerSourceVolume",
    "sourceVolume",
    "suppliedActivityUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalActivity: { type: "number" } },
  required: ["totalActivity"],
} as const;
/** Rescale supplied enzyme assay activity/volume units without selecting assay conditions or biological interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityPerSourceVolume, sourceVolume, suppliedActivityUnitFactor } =
    request;
  const compute = (): Output => {
    H.domain(sourceVolume >= 0);
    H.positive(suppliedActivityUnitFactor);
    return {
      totalActivity:
        activityPerSourceVolume * sourceVolume * suppliedActivityUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activityPerSourceVolume: 2,
    sourceVolume: 5,
    suppliedActivityUnitFactor: 10,
  },
  output: { totalActivity: 100 },
} satisfies ToolExample<Input, Output>;
export const enzymeActivityVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/enzyme-activity-volume-factor",
    title: "Enzyme Activity Volume Factor Tool",
    description:
      "Rescale supplied enzyme assay activity/volume units without selecting assay conditions or biological interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activityPerSourceVolume: { type: "number" },
        sourceVolume: { type: "number", minimum: 0 },
        suppliedActivityUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "activityPerSourceVolume",
        "sourceVolume",
        "suppliedActivityUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalActivity: { type: "number" } },
      required: ["totalActivity"],
    },
    ports: {
      inputs: [
        {
          id: "activityPerSourceVolume",
          label: "Activity Per Source Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceVolume",
          label: "Source Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedActivityUnitFactor",
          label: "Supplied Activity Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalActivity",
          label: "Total Activity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = enzymeActivityVolumeFactorTool.execute;
export default enzymeActivityVolumeFactorTool;
