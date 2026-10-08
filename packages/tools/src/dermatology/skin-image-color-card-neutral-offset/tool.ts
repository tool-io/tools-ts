import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceChannel: number;
  readonly measuredChannel: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceChannel: { type: "number" },
    measuredChannel: { type: "number" },
  },
  required: ["referenceChannel", "measuredChannel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate one supplied skin-image neutral-card channel residual without color correction or diagnostic interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceChannel, measuredChannel } = request;
  const compute = (): Output => {
    return { signedGap: measuredChannel - referenceChannel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceChannel: 12, measuredChannel: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const skinImageColorCardNeutralOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/skin-image-color-card-neutral-offset",
    title: "Skin Image Color Card Neutral Offset Tool",
    description:
      "Calculate one supplied skin-image neutral-card channel residual without color correction or diagnostic interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceChannel: { type: "number" },
        measuredChannel: { type: "number" },
      },
      required: ["referenceChannel", "measuredChannel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceChannel",
          label: "Reference Channel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredChannel",
          label: "Measured Channel",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = skinImageColorCardNeutralOffsetTool.execute;
export default skinImageColorCardNeutralOffsetTool;
