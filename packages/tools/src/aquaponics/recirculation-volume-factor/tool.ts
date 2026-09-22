import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly circulatedVolume: number;
  readonly loopVolume: number;
  readonly suppliedTimeSpan: number;
};
export type Output = {
  readonly volumeEquivalentCycles: number;
  readonly cyclesPerTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    circulatedVolume: { type: "number", minimum: 0 },
    loopVolume: { type: "number", exclusiveMinimum: 0 },
    suppliedTimeSpan: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["circulatedVolume", "loopVolume", "suppliedTimeSpan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeEquivalentCycles: { type: "number" },
    cyclesPerTime: { type: "number" },
  },
  required: ["volumeEquivalentCycles", "cyclesPerTime"],
} as const;
/** Convert supplied circulated volume into ideal loop-volume equivalents without assuming complete physical water replacement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { circulatedVolume, loopVolume, suppliedTimeSpan } = request;
  const compute = (): Output => {
    H.domain(circulatedVolume >= 0);
    H.positive(loopVolume);
    H.positive(suppliedTimeSpan);
    return {
      volumeEquivalentCycles: circulatedVolume / loopVolume,
      cyclesPerTime: circulatedVolume / loopVolume / suppliedTimeSpan,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { circulatedVolume: 200, loopVolume: 50, suppliedTimeSpan: 2 },
  output: { volumeEquivalentCycles: 4, cyclesPerTime: 2 },
} satisfies ToolExample<Input, Output>;
export const recirculationVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/recirculation-volume-factor",
    title: "Recirculation Volume Factor Tool",
    description:
      "Convert supplied circulated volume into ideal loop-volume equivalents without assuming complete physical water replacement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        circulatedVolume: { type: "number", minimum: 0 },
        loopVolume: { type: "number", exclusiveMinimum: 0 },
        suppliedTimeSpan: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["circulatedVolume", "loopVolume", "suppliedTimeSpan"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeEquivalentCycles: { type: "number" },
        cyclesPerTime: { type: "number" },
      },
      required: ["volumeEquivalentCycles", "cyclesPerTime"],
    },
    ports: {
      inputs: [
        {
          id: "circulatedVolume",
          label: "Circulated Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loopVolume",
          label: "Loop Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTimeSpan",
          label: "Supplied Time Span",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeEquivalentCycles",
          label: "Volume Equivalent Cycles",
          valueType: { type: "number" },
        },
        {
          id: "cyclesPerTime",
          label: "Cycles Per Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recirculationVolumeFactorTool.execute;
export default recirculationVolumeFactorTool;
