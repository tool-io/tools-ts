import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localResidentFee: number;
  readonly visitorFee: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localResidentFee: { type: "number" },
    visitorFee: { type: "number" },
  },
  required: ["localResidentFee", "visitorFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied visitor minus local-resident fee on a shared currency and service basis without selecting eligibility or fee policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localResidentFee, visitorFee } = request;
  const compute = (): Output => {
    return { signedGap: visitorFee - localResidentFee };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localResidentFee: 12, visitorFee: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const visitorFeeLocalresidentPriceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/visitor-fee-localresident-price-gap",
    title: "Visitor Fee Localresident Price Gap Tool",
    description:
      "Calculate supplied visitor minus local-resident fee on a shared currency and service basis without selecting eligibility or fee policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localResidentFee: { type: "number" },
        visitorFee: { type: "number" },
      },
      required: ["localResidentFee", "visitorFee"],
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
          id: "localResidentFee",
          label: "Local Resident Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "visitorFee",
          label: "Visitor Fee",
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
export const run = visitorFeeLocalresidentPriceGapTool.execute;
export default visitorFeeLocalresidentPriceGapTool;
