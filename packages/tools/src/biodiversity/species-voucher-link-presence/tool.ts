import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occurrenceId: string;
  readonly voucherReference: string;
};
export type Output = {
  readonly voucherLinked: boolean;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
    voucherReference: { type: "string", maxLength: 8192 },
  },
  required: ["occurrenceId", "voucherReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherLinked: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["voucherLinked", "label"],
} as const;
/** Identify an explicitly linked voucher reference without verifying the specimen or its taxonomic determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occurrenceId, voucherReference } = request;
  const compute = (): Output => {
    H.domain(occurrenceId.length > 0, "occurrenceId");
    const voucherLinked = voucherReference.trim().length > 0;
    return {
      voucherLinked,
      label:
        occurrenceId +
        "; voucher=" +
        (voucherLinked ? voucherReference : "not linked"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occurrenceId: "O17", voucherReference: "MUS-0017" },
  output: { voucherLinked: true, label: "O17; voucher=MUS-0017" },
} satisfies ToolExample<Input, Output>;
export const speciesVoucherLinkPresenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/species-voucher-link-presence",
    title: "Species Voucher Link Presence",
    description:
      "Identify an explicitly linked voucher reference without verifying the specimen or its taxonomic determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
        voucherReference: { type: "string", maxLength: 8192 },
      },
      required: ["occurrenceId", "voucherReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voucherLinked: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["voucherLinked", "label"],
    },
    ports: {
      inputs: [
        {
          id: "occurrenceId",
          label: "Occurrence Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "voucherReference",
          label: "Voucher Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "voucherLinked",
          label: "Voucher Linked",
          valueType: { type: "boolean" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = speciesVoucherLinkPresenceTool.execute;
export default speciesVoucherLinkPresenceTool;
