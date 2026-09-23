import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly signal: number;
  readonly totalPoolVolume: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    signal: { type: "number" },
    totalPoolVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volume", "signal", "totalPoolVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate tube pool volume weighted signal term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, signal, totalPoolVolume } = request;
  const compute = (): Output => {
    H.domain(volume >= 0);
    H.positive(totalPoolVolume);
    H.domain(volume <= totalPoolVolume);
    return { contribution: (volume * signal) / totalPoolVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 20, signal: 5, totalPoolVolume: 100 },
  output: { contribution: 1 },
} satisfies ToolExample<Input, Output>;
export const tubePoolVolumeWeightedSignalTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/tube-pool-volume-weighted-signal-term",
    title: "Tube Pool Volume Weighted Signal Term Tool",
    description:
      "Calculate tube pool volume weighted signal term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        signal: { type: "number" },
        totalPoolVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volume", "signal", "totalPoolVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPoolVolume",
          label: "Total Pool Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tubePoolVolumeWeightedSignalTermTool.execute;
export default tubePoolVolumeWeightedSignalTermTool;
