import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly angleRadians: number };
export type Output = { readonly wrapped: number; readonly fullTurns: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleRadians: { type: "number" } },
  required: ["angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wrapped: { type: "number" }, fullTurns: { type: "number" } },
  required: ["wrapped", "fullTurns"],
} as const;
/** Separate a supplied rotary phase into full turns and a nonnegative within-turn angle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleRadians } = request;
  const compute = (): Output => {
    const tau = 2 * Math.PI,
      fullTurns = Math.floor(angleRadians / tau),
      r = angleRadians % tau;
    return { wrapped: r < 0 ? r + tau : r, fullTurns };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleRadians: 21.991148575128552 },
  output: { wrapped: 3.141592653589793, fullTurns: 3 },
} satisfies ToolExample<Input, Output>;
export const rotaryAngleWrapTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/rotary-angle-wrap-token",
    title: "Rotary Angle Wrap Token Tool",
    description:
      "Separate a supplied rotary phase into full turns and a nonnegative within-turn angle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angleRadians: { type: "number" } },
      required: ["angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wrapped: { type: "number" },
        fullTurns: { type: "number" },
      },
      required: ["wrapped", "fullTurns"],
    },
    ports: {
      inputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        { id: "wrapped", label: "Wrapped", valueType: { type: "number" } },
        { id: "fullTurns", label: "Full Turns", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rotaryAngleWrapTokenTool.execute;
export default rotaryAngleWrapTokenTool;
