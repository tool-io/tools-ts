import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentAmperes: number;
  readonly positiveMeansCharging: boolean;
};
export type Output = {
  readonly state: string;
  readonly magnitudeAmperes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentAmperes: { type: "number" },
    positiveMeansCharging: { type: "boolean" },
  },
  required: ["currentAmperes", "positiveMeansCharging"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "string", maxLength: 8192 },
    magnitudeAmperes: { type: "number" },
  },
  required: ["state", "magnitudeAmperes"],
} as const;
/** Label an explicitly signed battery current under a caller-declared charging polarity convention without estimating state of charge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentAmperes, positiveMeansCharging } = request;
  const compute = (): Output => {
    return {
      state:
        currentAmperes === 0
          ? "zero-current"
          : currentAmperes > 0 === positiveMeansCharging
            ? "charging"
            : "discharging",
      magnitudeAmperes: Math.abs(currentAmperes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentAmperes: 2, positiveMeansCharging: true },
  output: { state: "charging", magnitudeAmperes: 2 },
} satisfies ToolExample<Input, Output>;
export const batteryChargeDischargePolarityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electrochemistry", "chemistry"],
      keywords: ["electrochemistry", "chemistry"],
    },
    id: "electrochemistry/battery-charge-discharge-polarity",
    title: "Battery Charge Discharge Polarity",
    description:
      "Label an explicitly signed battery current under a caller-declared charging polarity convention without estimating state of charge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentAmperes: { type: "number" },
        positiveMeansCharging: { type: "boolean" },
      },
      required: ["currentAmperes", "positiveMeansCharging"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "string", maxLength: 8192 },
        magnitudeAmperes: { type: "number" },
      },
      required: ["state", "magnitudeAmperes"],
    },
    ports: {
      inputs: [
        {
          id: "currentAmperes",
          label: "Current Amperes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansCharging",
          label: "Positive Means Charging",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "state", label: "State", valueType: { type: "string" } },
        {
          id: "magnitudeAmperes",
          label: "Magnitude Amperes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = batteryChargeDischargePolarityTool.execute;
export default batteryChargeDischargePolarityTool;
