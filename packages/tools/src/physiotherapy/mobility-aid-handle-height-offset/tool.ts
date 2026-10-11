import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedHandleHeight: number;
  readonly suppliedReferenceHeight: number;
};
export type Output = { readonly signedOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedHandleHeight: { type: "number", minimum: 0 },
    suppliedReferenceHeight: { type: "number", minimum: 0 },
  },
  required: ["recordedHandleHeight", "suppliedReferenceHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedOffset: { type: "number" } },
  required: ["signedOffset"],
} as const;
/** Compare explicit handle and reference heights without selecting or assessing a mobility-aid fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedHandleHeight, suppliedReferenceHeight } = request;
  const compute = (): Output => {
    H.domain(
      recordedHandleHeight >= 0 && suppliedReferenceHeight >= 0,
      "recordedHandleHeight",
    );
    return { signedOffset: recordedHandleHeight - suppliedReferenceHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedHandleHeight: 90, suppliedReferenceHeight: 87 },
  output: { signedOffset: 3 },
} satisfies ToolExample<Input, Output>;
export const mobilityAidHandleHeightOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["physiotherapy", "health and medicine"],
      keywords: ["physiotherapy", "health and medicine"],
    },
    id: "physiotherapy/mobility-aid-handle-height-offset",
    title: "Mobility Aid Handle Height Offset",
    description:
      "Compare explicit handle and reference heights without selecting or assessing a mobility-aid fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedHandleHeight: { type: "number", minimum: 0 },
        suppliedReferenceHeight: { type: "number", minimum: 0 },
      },
      required: ["recordedHandleHeight", "suppliedReferenceHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedOffset: { type: "number" } },
      required: ["signedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "recordedHandleHeight",
          label: "Recorded Handle Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceHeight",
          label: "Supplied Reference Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedOffset",
          label: "Signed Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mobilityAidHandleHeightOffsetTool.execute;
export default mobilityAidHandleHeightOffsetTool;
