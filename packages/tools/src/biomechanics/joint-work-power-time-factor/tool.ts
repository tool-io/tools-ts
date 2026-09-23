import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly meanPower: number; readonly duration: number };
export type Output = { readonly work: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanPower: { type: "number" },
    duration: { type: "number", minimum: 0 },
  },
  required: ["meanPower", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { work: { type: "number" } },
  required: ["work"],
} as const;
/** Integrate supplied mean mechanical joint power over elapsed time, retaining negative work. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meanPower, duration } = request;
  const compute = (): Output => {
    H.domain(duration >= 0);
    return { work: meanPower * duration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meanPower: 12, duration: 3 },
  output: { work: 36 },
} satisfies ToolExample<Input, Output>;
export const jointWorkPowerTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/joint-work-power-time-factor",
    title: "Joint Work Power Time Factor Tool",
    description:
      "Integrate supplied mean mechanical joint power over elapsed time, retaining negative work.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanPower: { type: "number" },
        duration: { type: "number", minimum: 0 },
      },
      required: ["meanPower", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { work: { type: "number" } },
      required: ["work"],
    },
    ports: {
      inputs: [
        {
          id: "meanPower",
          label: "Mean Power",
          required: true,
          valueType: { type: "number", unit: "W" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        { id: "work", label: "Work", valueType: { type: "number", unit: "J" } },
      ],
    },
  },
  calculate,
});
export const run = jointWorkPowerTimeFactorTool.execute;
export default jointWorkPowerTimeFactorTool;
