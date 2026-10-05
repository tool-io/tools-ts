import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly changeKind: string };
export type Output = { readonly referenceBase: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changeKind: { type: "string", maxLength: 8192, enum: ["rebate", "markup"] },
  },
  required: ["changeKind"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceBase: { type: "string", maxLength: 8192 } },
  required: ["referenceBase"],
} as const;
/** Identify the reference base for an ordinary sales-price rebate or a cost-based markup; no alternative trade convention is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { changeKind } = request;
  const compute = (): Output => {
    H.domain(["rebate", "markup"].includes(changeKind), "changeKind");
    return {
      referenceBase:
        changeKind === "rebate"
          ? "pre-rebate selling price"
          : "cost before markup",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { changeKind: "rebate" },
  output: { referenceBase: "pre-rebate selling price" },
} satisfies ToolExample<Input, Output>;
export const rebateVsMarkupBaseLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/rebate-vs-markup-base-label",
    title: "Rebate Vs Markup Base Label Tool",
    description:
      "Identify the reference base for an ordinary sales-price rebate or a cost-based markup; no alternative trade convention is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changeKind: {
          type: "string",
          maxLength: 8192,
          enum: ["rebate", "markup"],
        },
      },
      required: ["changeKind"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceBase: { type: "string", maxLength: 8192 } },
      required: ["referenceBase"],
    },
    ports: {
      inputs: [
        {
          id: "changeKind",
          label: "Change Kind",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "referenceBase",
          label: "Reference Base",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = rebateVsMarkupBaseLabelTool.execute;
export default rebateVsMarkupBaseLabelTool;
