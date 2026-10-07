import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storedOffsetSignal: number;
  readonly suppliedOffset: number;
};
export type Output = { readonly recoveredSignal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storedOffsetSignal: { type: "number" },
    suppliedOffset: { type: "number" },
  },
  required: ["storedOffsetSignal", "suppliedOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recoveredSignal: { type: "number" } },
  required: ["recoveredSignal"],
} as const;
/** Remove an explicit additive research-device signal offset without deriving calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storedOffsetSignal, suppliedOffset } = request;
  const compute = (): Output => {
    return { recoveredSignal: storedOffsetSignal - suppliedOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storedOffsetSignal: 15, suppliedOffset: 3 },
  output: { recoveredSignal: 12 },
} satisfies ToolExample<Input, Output>;
export const deviceSignalOffsetRecoveryTool = H.defineSchemaCalculation<
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
    id: "bioengineering/device-signal-offset-recovery",
    title: "Device Signal Offset Recovery",
    description:
      "Remove an explicit additive research-device signal offset without deriving calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storedOffsetSignal: { type: "number" },
        suppliedOffset: { type: "number" },
      },
      required: ["storedOffsetSignal", "suppliedOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recoveredSignal: { type: "number" } },
      required: ["recoveredSignal"],
    },
    ports: {
      inputs: [
        {
          id: "storedOffsetSignal",
          label: "Stored Offset Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recoveredSignal",
          label: "Recovered Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = deviceSignalOffsetRecoveryTool.execute;
export default deviceSignalOffsetRecoveryTool;
