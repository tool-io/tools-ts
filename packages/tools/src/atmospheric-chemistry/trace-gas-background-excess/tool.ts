import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredMixingRatio: number;
  readonly backgroundMixingRatio: number;
};
export type Output = { readonly excessMixingRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMixingRatio: { type: "number" },
    backgroundMixingRatio: { type: "number" },
  },
  required: ["measuredMixingRatio", "backgroundMixingRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { excessMixingRatio: { type: "number" } },
  required: ["excessMixingRatio"],
} as const;
/** Subtract a supplied matched background from a trace-gas mixing ratio in identical units, retaining negative excess observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredMixingRatio, backgroundMixingRatio } = request;
  const compute = (): Output => {
    return { excessMixingRatio: measuredMixingRatio - backgroundMixingRatio };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredMixingRatio: 420, backgroundMixingRatio: 410 },
  output: { excessMixingRatio: 10 },
} satisfies ToolExample<Input, Output>;
export const traceGasBackgroundExcessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/trace-gas-background-excess",
    title: "Trace Gas Background Excess",
    description:
      "Subtract a supplied matched background from a trace-gas mixing ratio in identical units, retaining negative excess observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredMixingRatio: { type: "number" },
        backgroundMixingRatio: { type: "number" },
      },
      required: ["measuredMixingRatio", "backgroundMixingRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { excessMixingRatio: { type: "number" } },
      required: ["excessMixingRatio"],
    },
    ports: {
      inputs: [
        {
          id: "measuredMixingRatio",
          label: "Measured Mixing Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backgroundMixingRatio",
          label: "Background Mixing Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "excessMixingRatio",
          label: "Excess Mixing Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = traceGasBackgroundExcessTool.execute;
export default traceGasBackgroundExcessTool;
