import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bulkVolume: number;
  readonly poreFraction: number;
  readonly fillFraction: number;
  readonly usePoreBase: boolean;
};
export type Output = {
  readonly denominatorVolume: number;
  readonly filledWaterVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkVolume: { type: "number", minimum: 0 },
    poreFraction: { type: "number", minimum: 0, maximum: 1 },
    fillFraction: { type: "number", minimum: 0, maximum: 1 },
    usePoreBase: { type: "boolean" },
  },
  required: ["bulkVolume", "poreFraction", "fillFraction", "usePoreBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorVolume: { type: "number" },
    filledWaterVolume: { type: "number" },
  },
  required: ["denominatorVolume", "filledWaterVolume"],
} as const;
/** Apply an explicit bulk-versus-pore-volume fill-fraction basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bulkVolume, poreFraction, fillFraction, usePoreBase } = request;
  const compute = (): Output => {
    H.domain(bulkVolume >= 0);
    H.probability(poreFraction);
    H.probability(fillFraction);
    return {
      denominatorVolume: usePoreBase ? bulkVolume * poreFraction : bulkVolume,
      filledWaterVolume:
        (usePoreBase ? bulkVolume * poreFraction : bulkVolume) * fillFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bulkVolume: 100,
    poreFraction: 0.4,
    fillFraction: 0.5,
    usePoreBase: true,
  },
  output: { denominatorVolume: 40, filledWaterVolume: 20 },
} satisfies ToolExample<Input, Output>;
export const growbedPoreVolumeBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/growbed-pore-volume-base-flag",
    title: "Growbed Pore Volume Base Flag Tool",
    description:
      "Apply an explicit bulk-versus-pore-volume fill-fraction basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bulkVolume: { type: "number", minimum: 0 },
        poreFraction: { type: "number", minimum: 0, maximum: 1 },
        fillFraction: { type: "number", minimum: 0, maximum: 1 },
        usePoreBase: { type: "boolean" },
      },
      required: ["bulkVolume", "poreFraction", "fillFraction", "usePoreBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorVolume: { type: "number" },
        filledWaterVolume: { type: "number" },
      },
      required: ["denominatorVolume", "filledWaterVolume"],
    },
    ports: {
      inputs: [
        {
          id: "bulkVolume",
          label: "Bulk Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "poreFraction",
          label: "Pore Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fillFraction",
          label: "Fill Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usePoreBase",
          label: "Use Pore Base",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorVolume",
          label: "Denominator Volume",
          valueType: { type: "number" },
        },
        {
          id: "filledWaterVolume",
          label: "Filled Water Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growbedPoreVolumeBaseFlagTool.execute;
export default growbedPoreVolumeBaseFlagTool;
