import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredSignal: number;
  readonly referenceSignal: number;
};
export type Output = { readonly signalRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredSignal: { type: "number" },
    referenceSignal: { type: "number" },
  },
  required: ["measuredSignal", "referenceSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signalRatio: { type: "number" } },
  required: ["signalRatio"],
} as const;
/** Divide supplied signed phantom signal by a nonzero reference signal without clinical calibration claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredSignal, referenceSignal } = request;
  const compute = (): Output => {
    H.domain(referenceSignal !== 0, "referenceSignal");
    return { signalRatio: measuredSignal / referenceSignal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredSignal: 8, referenceSignal: 10 },
  output: { signalRatio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const phantomReferenceSignalRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/phantom-reference-signal-ratio",
    title: "Phantom Reference Signal Ratio",
    description:
      "Divide supplied signed phantom signal by a nonzero reference signal without clinical calibration claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredSignal: { type: "number" },
        referenceSignal: { type: "number" },
      },
      required: ["measuredSignal", "referenceSignal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signalRatio: { type: "number" } },
      required: ["signalRatio"],
    },
    ports: {
      inputs: [
        {
          id: "measuredSignal",
          label: "Measured Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSignal",
          label: "Reference Signal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signalRatio",
          label: "Signal Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = phantomReferenceSignalRatioTool.execute;
export default phantomReferenceSignalRatioTool;
