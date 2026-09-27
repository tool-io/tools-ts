import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftUnit: string;
  readonly rightUnit: string;
  readonly shareRequested: boolean;
};
export type Output = { readonly canShare: boolean; readonly suffix: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftUnit: { type: "string", maxLength: 8192 },
    rightUnit: { type: "string", maxLength: 8192 },
    shareRequested: { type: "boolean" },
  },
  required: ["leftUnit", "rightUnit", "shareRequested"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canShare: { type: "boolean" },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["canShare", "suffix"],
} as const;
/** Only identical supplied endpoint unit labels may share a suffix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftUnit, rightUnit, shareRequested } = request;
  const compute = (): Output => {
    const canShare = shareRequested && leftUnit === rightUnit;
    return { canShare, suffix: canShare ? leftUnit : "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftUnit: "m", rightUnit: "m", shareRequested: true },
  output: { canShare: true, suffix: "m" },
} satisfies ToolExample<Input, Output>;
export const intervalEndpointUnitSharingFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/interval-endpoint-unit-sharing-flag",
    title: "Interval Endpoint Unit Sharing Flag Tool",
    description:
      "Only identical supplied endpoint unit labels may share a suffix.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftUnit: { type: "string", maxLength: 8192 },
        rightUnit: { type: "string", maxLength: 8192 },
        shareRequested: { type: "boolean" },
      },
      required: ["leftUnit", "rightUnit", "shareRequested"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canShare: { type: "boolean" },
        suffix: { type: "string", maxLength: 8192 },
      },
      required: ["canShare", "suffix"],
    },
    ports: {
      inputs: [
        {
          id: "leftUnit",
          label: "Left Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rightUnit",
          label: "Right Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "shareRequested",
          label: "Share Requested",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "canShare",
          label: "Can Share",
          valueType: { type: "boolean", unit: "1" },
        },
        { id: "suffix", label: "Suffix", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = intervalEndpointUnitSharingFlagTool.execute;
export default intervalEndpointUnitSharingFlagTool;
