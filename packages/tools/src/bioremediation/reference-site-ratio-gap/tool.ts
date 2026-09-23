import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteValue: number;
  readonly referenceValue: number;
  readonly suppliedRatio: number;
};
export type Output = { readonly ratio: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteValue: { type: "number" },
    referenceValue: { type: "number" },
    suppliedRatio: { type: "number" },
  },
  required: ["siteValue", "referenceValue", "suppliedRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, residual: { type: "number" } },
  required: ["ratio", "residual"],
} as const;
/** Calculate reference site ratio gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siteValue, referenceValue, suppliedRatio } = request;
  const compute = (): Output => {
    H.domain(referenceValue !== 0);
    return {
      ratio: siteValue / referenceValue,
      residual: suppliedRatio - siteValue / referenceValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { siteValue: 12, referenceValue: 10, suppliedRatio: 1.3 },
  output: { ratio: 1.2, residual: 0.10000000000000009 },
} satisfies ToolExample<Input, Output>;
export const referenceSiteRatioGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/reference-site-ratio-gap",
    title: "Reference Site Ratio Gap Tool",
    description:
      "Calculate reference site ratio gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteValue: { type: "number" },
        referenceValue: { type: "number" },
        suppliedRatio: { type: "number" },
      },
      required: ["siteValue", "referenceValue", "suppliedRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" }, residual: { type: "number" } },
      required: ["ratio", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "siteValue",
          label: "Site Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceValue",
          label: "Reference Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRatio",
          label: "Supplied Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = referenceSiteRatioGapTool.execute;
export default referenceSiteRatioGapTool;
