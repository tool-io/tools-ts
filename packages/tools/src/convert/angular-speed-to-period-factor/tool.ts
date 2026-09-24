import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly angularSpeedRadiansPerTime: number };
export type Output = { readonly period: number; readonly direction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angularSpeedRadiansPerTime: { type: "number" } },
  required: ["angularSpeedRadiansPerTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { period: { type: "number" }, direction: { type: "integer" } },
  required: ["period", "direction"],
} as const;
/** Calculate angular speed to period factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularSpeedRadiansPerTime } = request;
  const compute = (): Output => {
    H.domain(angularSpeedRadiansPerTime !== 0);
    return {
      period: (2 * Math.PI) / Math.abs(angularSpeedRadiansPerTime),
      direction: Math.sign(angularSpeedRadiansPerTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angularSpeedRadiansPerTime: 6.283185307179586 },
  output: { period: 1, direction: 1 },
} satisfies ToolExample<Input, Output>;
export const angularSpeedToPeriodFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/angular-speed-to-period-factor",
    title: "Angular Speed To Period Factor Tool",
    description:
      "Calculate angular speed to period factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angularSpeedRadiansPerTime: { type: "number" } },
      required: ["angularSpeedRadiansPerTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        period: { type: "number" },
        direction: { type: "integer" },
      },
      required: ["period", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "angularSpeedRadiansPerTime",
          label: "Angular Speed Radians Per Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "period", label: "Period", valueType: { type: "number" } },
        { id: "direction", label: "Direction", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = angularSpeedToPeriodFactorTool.execute;
export default angularSpeedToPeriodFactorTool;
