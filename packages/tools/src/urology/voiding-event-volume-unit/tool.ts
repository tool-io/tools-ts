import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly volume: number; readonly inputUnit: string };
export type Output = { readonly milliliters: number; readonly liters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192, enum: ["mL", "L"] },
  },
  required: ["volume", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { milliliters: { type: "number" }, liters: { type: "number" } },
  required: ["milliliters", "liters"],
} as const;
/** Convert an explicitly recorded voiding-event volume between milliliters and liters without clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, inputUnit } = request;
  const compute = (): Output => {
    H.domain(volume >= 0, "volume");
    H.domain(["mL", "L"].includes(inputUnit), "inputUnit");
    return {
      milliliters: inputUnit === "L" ? volume * 1000 : volume,
      liters: inputUnit === "mL" ? volume / 1000 : volume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 250, inputUnit: "mL" },
  output: { milliliters: 250, liters: 0.25 },
} satisfies ToolExample<Input, Output>;
export const voidingEventVolumeUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["urology", "health and medicine"],
      keywords: ["urology", "health and medicine"],
    },
    id: "urology/voiding-event-volume-unit",
    title: "Voiding Event Volume Unit",
    description:
      "Convert an explicitly recorded voiding-event volume between milliliters and liters without clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        inputUnit: { type: "string", maxLength: 8192, enum: ["mL", "L"] },
      },
      required: ["volume", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        milliliters: { type: "number" },
        liters: { type: "number" },
      },
      required: ["milliliters", "liters"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "milliliters",
          label: "Milliliters",
          valueType: { type: "number" },
        },
        { id: "liters", label: "Liters", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = voidingEventVolumeUnitTool.execute;
export default voidingEventVolumeUnitTool;
