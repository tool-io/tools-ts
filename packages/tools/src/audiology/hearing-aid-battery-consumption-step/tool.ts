import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMilliampHours: number;
  readonly currentMilliamps: number;
  readonly operatingHours: number;
};
export type Output = {
  readonly consumedMilliampHours: number;
  readonly remainingMilliampHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMilliampHours: { type: "number", minimum: 0 },
    currentMilliamps: { type: "number", minimum: 0 },
    operatingHours: { type: "number", minimum: 0 },
  },
  required: ["openingMilliampHours", "currentMilliamps", "operatingHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedMilliampHours: { type: "number" },
    remainingMilliampHours: { type: "number" },
  },
  required: ["consumedMilliampHours", "remainingMilliampHours"],
} as const;
/** Subtract ideal constant-current charge use from supplied battery capacity without modeling chemistry, voltage or device safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingMilliampHours, currentMilliamps, operatingHours } = request;
  const compute = (): Output => {
    H.domain(openingMilliampHours >= 0, "openingMilliampHours");
    H.domain(currentMilliamps >= 0, "currentMilliamps");
    H.domain(operatingHours >= 0, "operatingHours");
    return {
      consumedMilliampHours: currentMilliamps * operatingHours,
      remainingMilliampHours:
        openingMilliampHours - currentMilliamps * operatingHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingMilliampHours: 100, currentMilliamps: 2, operatingHours: 12 },
  output: { consumedMilliampHours: 24, remainingMilliampHours: 76 },
} satisfies ToolExample<Input, Output>;
export const hearingAidBatteryConsumptionStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/hearing-aid-battery-consumption-step",
    title: "Hearing Aid Battery Consumption Step",
    description:
      "Subtract ideal constant-current charge use from supplied battery capacity without modeling chemistry, voltage or device safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingMilliampHours: { type: "number", minimum: 0 },
        currentMilliamps: { type: "number", minimum: 0 },
        operatingHours: { type: "number", minimum: 0 },
      },
      required: ["openingMilliampHours", "currentMilliamps", "operatingHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumedMilliampHours: { type: "number" },
        remainingMilliampHours: { type: "number" },
      },
      required: ["consumedMilliampHours", "remainingMilliampHours"],
    },
    ports: {
      inputs: [
        {
          id: "openingMilliampHours",
          label: "Opening Milliamp Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentMilliamps",
          label: "Current Milliamps",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "operatingHours",
          label: "Operating Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "consumedMilliampHours",
          label: "Consumed Milliamp Hours",
          valueType: { type: "number" },
        },
        {
          id: "remainingMilliampHours",
          label: "Remaining Milliamp Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hearingAidBatteryConsumptionStepTool.execute;
export default hearingAidBatteryConsumptionStepTool;
