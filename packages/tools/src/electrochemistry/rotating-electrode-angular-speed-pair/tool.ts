import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly revolutionsPerMinute: number };
export type Output = { readonly radiansPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { revolutionsPerMinute: { type: "number" } },
  required: ["revolutionsPerMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radiansPerSecond: { type: "number" } },
  required: ["radiansPerSecond"],
} as const;
/** Convert a supplied signed rotating-electrode speed from revolutions per minute to radians per second. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { revolutionsPerMinute } = request;
  const compute = (): Output => {
    return { radiansPerSecond: revolutionsPerMinute * (Math.PI / 30) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { revolutionsPerMinute: 60 },
  output: { radiansPerSecond: 6.283185307179586 },
} satisfies ToolExample<Input, Output>;
export const rotatingElectrodeAngularSpeedPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/rotating-electrode-angular-speed-pair",
    title: "Rotating Electrode Angular Speed Pair Tool",
    description:
      "Convert a supplied signed rotating-electrode speed from revolutions per minute to radians per second.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { revolutionsPerMinute: { type: "number" } },
      required: ["revolutionsPerMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radiansPerSecond: { type: "number" } },
      required: ["radiansPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "revolutionsPerMinute",
          label: "Revolutions Per Minute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radiansPerSecond",
          label: "Radians Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rotatingElectrodeAngularSpeedPairTool.execute;
export default rotatingElectrodeAngularSpeedPairTool;
