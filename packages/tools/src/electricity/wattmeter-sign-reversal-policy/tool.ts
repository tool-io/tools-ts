import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedWatts: number;
  readonly voltagePolarityReversed: boolean;
  readonly currentPolarityReversed: boolean;
};
export type Output = { readonly referenceWatts: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedWatts: { type: "number" },
    voltagePolarityReversed: { type: "boolean" },
    currentPolarityReversed: { type: "boolean" },
  },
  required: [
    "recordedWatts",
    "voltagePolarityReversed",
    "currentPolarityReversed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceWatts: { type: "number" } },
  required: ["referenceWatts"],
} as const;
/** Apply explicit voltage and current reference-polarity reversals to signed wattmeter power. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedWatts, voltagePolarityReversed, currentPolarityReversed } =
    request;
  const compute = (): Output => {
    return {
      referenceWatts:
        recordedWatts *
        (voltagePolarityReversed !== currentPolarityReversed ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedWatts: 120,
    voltagePolarityReversed: true,
    currentPolarityReversed: false,
  },
  output: { referenceWatts: -120 },
} satisfies ToolExample<Input, Output>;
export const wattmeterSignReversalPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electricity", "engineering"],
      keywords: ["electricity", "engineering"],
    },
    id: "electricity/wattmeter-sign-reversal-policy",
    title: "Wattmeter Sign Reversal Policy",
    description:
      "Apply explicit voltage and current reference-polarity reversals to signed wattmeter power.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedWatts: { type: "number" },
        voltagePolarityReversed: { type: "boolean" },
        currentPolarityReversed: { type: "boolean" },
      },
      required: [
        "recordedWatts",
        "voltagePolarityReversed",
        "currentPolarityReversed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceWatts: { type: "number" } },
      required: ["referenceWatts"],
    },
    ports: {
      inputs: [
        {
          id: "recordedWatts",
          label: "Recorded Watts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voltagePolarityReversed",
          label: "Voltage Polarity Reversed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "currentPolarityReversed",
          label: "Current Polarity Reversed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "referenceWatts",
          label: "Reference Watts",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wattmeterSignReversalPolicyTool.execute;
export default wattmeterSignReversalPolicyTool;
