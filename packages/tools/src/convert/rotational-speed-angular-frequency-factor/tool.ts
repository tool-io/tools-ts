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
/** Convert signed revolutions per minute into radians per second. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { revolutionsPerMinute } = input;
  const compute = (): Output => {
    return { radiansPerSecond: (revolutionsPerMinute * Math.PI) / 30 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { revolutionsPerMinute: 60 },
  output: { radiansPerSecond: 6.283185307179585 },
} satisfies ToolExample<Input, Output>;
export const rotationalSpeedAngularFrequencyFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/rotational-speed-angular-frequency-factor",
      title: "Rotational Speed Angular Frequency Factor Tool",
      description:
        "Convert signed revolutions per minute into radians per second.",
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
export const run = rotationalSpeedAngularFrequencyFactorTool.execute;
export default rotationalSpeedAngularFrequencyFactorTool;
