import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly voucherReference: string;
  readonly verifiedBySource: boolean;
};
export type Output = { readonly label: string; readonly linked: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    voucherReference: { type: "string", maxLength: 8192 },
    verifiedBySource: { type: "boolean" },
  },
  required: ["observationId", "voucherReference", "verifiedBySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    linked: { type: "boolean" },
  },
  required: ["label", "linked"],
} as const;
/** Label explicit voucher linkage and source-recorded verification without independently verifying an observation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, voucherReference, verifiedBySource } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    const linked = voucherReference.trim().length > 0;
    H.domain(!verifiedBySource || linked, "verifiedBySource");
    return {
      label:
        observationId +
        "; voucher=" +
        (linked ? voucherReference : "not linked") +
        "; source verification=" +
        (verifiedBySource ? "recorded" : "not recorded"),
      linked,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    voucherReference: "V42",
    verifiedBySource: true,
  },
  output: {
    label: "O17; voucher=V42; source verification=recorded",
    linked: true,
  },
} satisfies ToolExample<Input, Output>;
export const speciesObservationVoucherStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/species-observation-voucher-status",
    title: "Species Observation Voucher Status",
    description:
      "Label explicit voucher linkage and source-recorded verification without independently verifying an observation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        voucherReference: { type: "string", maxLength: 8192 },
        verifiedBySource: { type: "boolean" },
      },
      required: ["observationId", "voucherReference", "verifiedBySource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        linked: { type: "boolean" },
      },
      required: ["label", "linked"],
    },
    ports: {
      inputs: [
        {
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "voucherReference",
          label: "Voucher Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "verifiedBySource",
          label: "Verified By Source",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "linked", label: "Linked", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = speciesObservationVoucherStatusTool.execute;
export default speciesObservationVoucherStatusTool;
