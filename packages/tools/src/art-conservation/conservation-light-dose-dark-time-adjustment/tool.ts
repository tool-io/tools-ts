import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly illuminance: number;
  readonly scheduledHours: number;
  readonly darkHours: number;
  readonly exposureDays: number;
};
export type Output = { readonly litHours: number; readonly dose: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    illuminance: { type: "number", minimum: 0 },
    scheduledHours: { type: "number" },
    darkHours: { type: "number", minimum: 0 },
    exposureDays: { type: "integer", minimum: 0 },
  },
  required: ["illuminance", "scheduledHours", "darkHours", "exposureDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { litHours: { type: "number" }, dose: { type: "number" } },
  required: ["litHours", "dose"],
} as const;
/** Arithmetic lux-hour dose from explicit light and dark time; no material-specific safe exposure limit is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { illuminance, scheduledHours, darkHours, exposureDays } = request;
  const compute = (): Output => {
    H.domain(illuminance >= 0 && darkHours >= 0 && scheduledHours >= darkHours);
    H.integer(exposureDays, 0);
    return {
      litHours: (scheduledHours - darkHours) * exposureDays,
      dose: illuminance * (scheduledHours - darkHours) * exposureDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    illuminance: 50,
    scheduledHours: 8,
    darkHours: 2,
    exposureDays: 100,
  },
  output: { litHours: 600, dose: 30000 },
} satisfies ToolExample<Input, Output>;
export const conservationLightDoseDarkTimeAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-conservation/conservation-light-dose-dark-time-adjustment",
      title: "Conservation Light Dose Dark Time Adjustment Tool",
      description:
        "Arithmetic lux-hour dose from explicit light and dark time; no material-specific safe exposure limit is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          illuminance: { type: "number", minimum: 0 },
          scheduledHours: { type: "number" },
          darkHours: { type: "number", minimum: 0 },
          exposureDays: { type: "integer", minimum: 0 },
        },
        required: [
          "illuminance",
          "scheduledHours",
          "darkHours",
          "exposureDays",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { litHours: { type: "number" }, dose: { type: "number" } },
        required: ["litHours", "dose"],
      },
      ports: {
        inputs: [
          {
            id: "illuminance",
            label: "Illuminance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scheduledHours",
            label: "Scheduled Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "darkHours",
            label: "Dark Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exposureDays",
            label: "Exposure Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "litHours", label: "Lit Hours", valueType: { type: "number" } },
          { id: "dose", label: "Dose", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = conservationLightDoseDarkTimeAdjustmentTool.execute;
export default conservationLightDoseDarkTimeAdjustmentTool;
