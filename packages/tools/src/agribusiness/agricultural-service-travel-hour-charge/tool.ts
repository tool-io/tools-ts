import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly travelHours: number;
  readonly suppliedHourlyCharge: number;
};
export type Output = { readonly travelCharge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    travelHours: { type: "number", minimum: 0 },
    suppliedHourlyCharge: { type: "number", minimum: 0 },
  },
  required: ["travelHours", "suppliedHourlyCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { travelCharge: { type: "number" } },
  required: ["travelCharge"],
} as const;
/** Multiply explicit agricultural-service travel hours by a supplied hourly charge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { travelHours, suppliedHourlyCharge } = request;
  const compute = (): Output => {
    H.domain(travelHours >= 0, "travelHours");
    H.domain(suppliedHourlyCharge >= 0, "suppliedHourlyCharge");
    return { travelCharge: travelHours * suppliedHourlyCharge };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { travelHours: 1.5, suppliedHourlyCharge: 40 },
  output: { travelCharge: 60 },
} satisfies ToolExample<Input, Output>;
export const agriculturalServiceTravelHourChargeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["cost", "learn"],
        fields: ["agribusiness", "agriculture"],
        keywords: ["agribusiness", "agriculture"],
      },
      id: "agribusiness/agricultural-service-travel-hour-charge",
      title: "Agricultural Service Travel Hour Charge",
      description:
        "Multiply explicit agricultural-service travel hours by a supplied hourly charge.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          travelHours: { type: "number", minimum: 0 },
          suppliedHourlyCharge: { type: "number", minimum: 0 },
        },
        required: ["travelHours", "suppliedHourlyCharge"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { travelCharge: { type: "number" } },
        required: ["travelCharge"],
      },
      ports: {
        inputs: [
          {
            id: "travelHours",
            label: "Travel Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedHourlyCharge",
            label: "Supplied Hourly Charge",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "travelCharge",
            label: "Travel Charge",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalServiceTravelHourChargeTool.execute;
export default agriculturalServiceTravelHourChargeTool;
