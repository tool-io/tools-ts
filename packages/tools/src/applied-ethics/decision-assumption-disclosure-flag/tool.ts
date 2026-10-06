import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assumptionRequired: boolean;
  readonly assumptionDisclosed: boolean;
};
export type Output = { readonly disclosureMissing: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assumptionRequired: { type: "boolean" },
    assumptionDisclosed: { type: "boolean" },
  },
  required: ["assumptionRequired", "assumptionDisclosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { disclosureMissing: { type: "boolean" } },
  required: ["disclosureMissing"],
} as const;
/** Identify a missing disclosure from explicit assumption-required and disclosed flags without deriving those requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assumptionRequired, assumptionDisclosed } = request;
  const compute = (): Output => {
    return { disclosureMissing: assumptionRequired && !assumptionDisclosed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assumptionRequired: true, assumptionDisclosed: false },
  output: { disclosureMissing: true },
} satisfies ToolExample<Input, Output>;
export const decisionAssumptionDisclosureFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/decision-assumption-disclosure-flag",
    title: "Decision Assumption Disclosure Flag",
    description:
      "Identify a missing disclosure from explicit assumption-required and disclosed flags without deriving those requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assumptionRequired: { type: "boolean" },
        assumptionDisclosed: { type: "boolean" },
      },
      required: ["assumptionRequired", "assumptionDisclosed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { disclosureMissing: { type: "boolean" } },
      required: ["disclosureMissing"],
    },
    ports: {
      inputs: [
        {
          id: "assumptionRequired",
          label: "Assumption Required",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "assumptionDisclosed",
          label: "Assumption Disclosed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "disclosureMissing",
          label: "Disclosure Missing",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = decisionAssumptionDisclosureFlagTool.execute;
export default decisionAssumptionDisclosureFlagTool;
