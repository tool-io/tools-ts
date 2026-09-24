import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly perRadianFrequency: number };
export type Output = { readonly perHertz: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perRadianFrequency: { type: "number" } },
  required: ["perRadianFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perHertz: { type: "number" } },
  required: ["perHertz"],
} as const;
/** Convert density per radian per second into density per hertz through d omega / d f = 2 pi. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { perRadianFrequency } = input;
  const compute = (): Output => {
    return { perHertz: 2 * Math.PI * perRadianFrequency };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { perRadianFrequency: 2 },
  output: { perHertz: 12.566370614359172 },
} satisfies ToolExample<Input, Output>;
export const spectralAngularFrequencyFrequencyDensityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/spectral-angular-frequency-frequency-density",
      title: "Spectral Angular Frequency Frequency Density Tool",
      description:
        "Convert density per radian per second into density per hertz through d omega / d f = 2 pi.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { perRadianFrequency: { type: "number" } },
        required: ["perRadianFrequency"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { perHertz: { type: "number" } },
        required: ["perHertz"],
      },
      ports: {
        inputs: [
          {
            id: "perRadianFrequency",
            label: "Per Radian Frequency",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "perHertz", label: "Per Hertz", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = spectralAngularFrequencyFrequencyDensityTool.execute;
export default spectralAngularFrequencyFrequencyDensityTool;
