import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caughtMilliliters: number;
  readonly collectionMinutes: number;
};
export type Output = {
  readonly millilitersPerMinute: number;
  readonly litersPerHour: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caughtMilliliters: { type: "number", minimum: 0 },
    collectionMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["caughtMilliliters", "collectionMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    millilitersPerMinute: { type: "number" },
    litersPerHour: { type: "number" },
  },
  required: ["millilitersPerMinute", "litersPerHour"],
} as const;
/** Convert an explicit emitter catch and collection duration to volume flow without selecting irrigation requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caughtMilliliters, collectionMinutes } = request;
  const compute = (): Output => {
    H.domain(caughtMilliliters >= 0, "caughtMilliliters");
    (H.domain(collectionMinutes > 0, "collectionMinutes"), collectionMinutes);
    return {
      millilitersPerMinute: caughtMilliliters / collectionMinutes,
      litersPerHour: (caughtMilliliters / collectionMinutes) * 0.06,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caughtMilliliters: 100, collectionMinutes: 2 },
  output: { millilitersPerMinute: 50, litersPerHour: 3 },
} satisfies ToolExample<Input, Output>;
export const hydroponicEmitterCatchVolumeRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/hydroponic-emitter-catch-volume-rate",
    title: "Hydroponic Emitter Catch Volume Rate",
    description:
      "Convert an explicit emitter catch and collection duration to volume flow without selecting irrigation requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caughtMilliliters: { type: "number", minimum: 0 },
        collectionMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["caughtMilliliters", "collectionMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        millilitersPerMinute: { type: "number" },
        litersPerHour: { type: "number" },
      },
      required: ["millilitersPerMinute", "litersPerHour"],
    },
    ports: {
      inputs: [
        {
          id: "caughtMilliliters",
          label: "Caught Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collectionMinutes",
          label: "Collection Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "millilitersPerMinute",
          label: "Milliliters Per Minute",
          valueType: { type: "number" },
        },
        {
          id: "litersPerHour",
          label: "Liters Per Hour",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydroponicEmitterCatchVolumeRateTool.execute;
export default hydroponicEmitterCatchVolumeRateTool;
