import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedLot: string;
  readonly recalledLot: string;
  readonly caseSensitive: boolean;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedLot: { type: "string", maxLength: 8192, minLength: 1 },
    recalledLot: { type: "string", maxLength: 8192, minLength: 1 },
    caseSensitive: { type: "boolean" },
  },
  required: ["recordedLot", "recalledLot", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Compare explicit lot strings under a caller-selected case policy without retrieving recall notices or inferring recall status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedLot, recalledLot, caseSensitive } = request;
  const compute = (): Output => {
    H.domain(recordedLot.length > 0 && recalledLot.length > 0, "recordedLot");
    return {
      matches: caseSensitive
        ? recordedLot === recalledLot
        : recordedLot.toLowerCase() === recalledLot.toLowerCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedLot: "AB-17", recalledLot: "AB-17", caseSensitive: true },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const communityDrugRecallLotCompareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/community-drug-recall-lot-compare",
    title: "Community Drug Recall Lot Compare",
    description:
      "Compare explicit lot strings under a caller-selected case policy without retrieving recall notices or inferring recall status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedLot: { type: "string", maxLength: 8192, minLength: 1 },
        recalledLot: { type: "string", maxLength: 8192, minLength: 1 },
        caseSensitive: { type: "boolean" },
      },
      required: ["recordedLot", "recalledLot", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "recordedLot",
          label: "Recorded Lot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recalledLot",
          label: "Recalled Lot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = communityDrugRecallLotCompareTool.execute;
export default communityDrugRecallLotCompareTool;
