import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedVolume: number;
  readonly flowPerHour: number;
  readonly voidFraction: number;
};
export type Output = {
  readonly emptyBedMinutes: number;
  readonly voidResidenceMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedVolume: { type: "number", minimum: 0 },
    flowPerHour: { type: "number", exclusiveMinimum: 0 },
    voidFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["bedVolume", "flowPerHour", "voidFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emptyBedMinutes: { type: "number" },
    voidResidenceMinutes: { type: "number" },
  },
  required: ["emptyBedMinutes", "voidResidenceMinutes"],
} as const;
/** Distinguish empty-bed contact time V/Q from nominal interstitial void-volume residence time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedVolume, flowPerHour, voidFraction } = request;
  const compute = (): Output => {
    H.domain(bedVolume >= 0);
    H.positive(flowPerHour);
    H.probability(voidFraction);
    return {
      emptyBedMinutes: (60 * bedVolume) / flowPerHour,
      voidResidenceMinutes: (60 * bedVolume * voidFraction) / flowPerHour,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bedVolume: 10, flowPerHour: 30, voidFraction: 0.4 },
  output: { emptyBedMinutes: 20, voidResidenceMinutes: 8 },
} satisfies ToolExample<Input, Output>;
export const activatedCarbonEmptyBedContactTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/activated-carbon-empty-bed-contact-time",
    title: "Activated Carbon Empty BED Contact Time Tool",
    description:
      "Distinguish empty-bed contact time V/Q from nominal interstitial void-volume residence time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedVolume: { type: "number", minimum: 0 },
        flowPerHour: { type: "number", exclusiveMinimum: 0 },
        voidFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["bedVolume", "flowPerHour", "voidFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emptyBedMinutes: { type: "number" },
        voidResidenceMinutes: { type: "number" },
      },
      required: ["emptyBedMinutes", "voidResidenceMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "bedVolume",
          label: "Bed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flowPerHour",
          label: "Flow Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voidFraction",
          label: "Void Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "emptyBedMinutes",
          label: "Empty Bed Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "voidResidenceMinutes",
          label: "Void Residence Minutes",
          valueType: { type: "number", unit: "min" },
        },
      ],
    },
  },
  calculate,
});
export const run = activatedCarbonEmptyBedContactTimeTool.execute;
export default activatedCarbonEmptyBedContactTimeTool;
