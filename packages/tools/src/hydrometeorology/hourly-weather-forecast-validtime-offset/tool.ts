import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedEpochHours: number;
  readonly validEpochHours: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedEpochHours: { type: "number" },
    validEpochHours: { type: "number" },
  },
  required: ["issuedEpochHours", "validEpochHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied forecast valid-minus-issue epoch hours without fetching a forecast or resolving local time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedEpochHours, validEpochHours } = request;
  const compute = (): Output => {
    return { signedGap: validEpochHours - issuedEpochHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issuedEpochHours: 12, validEpochHours: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const hourlyWeatherForecastValidtimeOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/hourly-weather-forecast-validtime-offset",
      title: "Hourly Weather Forecast Validtime Offset Tool",
      description:
        "Calculate supplied forecast valid-minus-issue epoch hours without fetching a forecast or resolving local time.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issuedEpochHours: { type: "number" },
          validEpochHours: { type: "number" },
        },
        required: ["issuedEpochHours", "validEpochHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "issuedEpochHours",
            label: "Issued Epoch Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "validEpochHours",
            label: "Valid Epoch Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hourlyWeatherForecastValidtimeOffsetTool.execute;
export default hourlyWeatherForecastValidtimeOffsetTool;
