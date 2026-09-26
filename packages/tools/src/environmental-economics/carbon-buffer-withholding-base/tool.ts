import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossCredits: number;
  readonly excludedCredits: number;
  readonly withheldFraction: number;
  readonly withholdBeforeExclusion: boolean;
};
export type Output = { readonly withheld: number; readonly issued: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCredits: { type: "number", minimum: 0 },
    excludedCredits: { type: "number", minimum: 0 },
    withheldFraction: { type: "number", minimum: 0, maximum: 1 },
    withholdBeforeExclusion: { type: "boolean" },
  },
  required: [
    "grossCredits",
    "excludedCredits",
    "withheldFraction",
    "withholdBeforeExclusion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withheld: { type: "number" }, issued: { type: "number" } },
  required: ["withheld", "issued"],
} as const;
/** Apply explicit withholding/exclusion order without determining carbon-credit integrity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    grossCredits,
    excludedCredits,
    withheldFraction,
    withholdBeforeExclusion,
  } = request;
  const compute = (): Output => {
    H.domain(
      grossCredits >= 0 &&
        excludedCredits >= 0 &&
        excludedCredits <= grossCredits,
    );
    H.probability(withheldFraction);
    return {
      withheld:
        (withholdBeforeExclusion
          ? grossCredits
          : grossCredits - excludedCredits) * withheldFraction,
      issued:
        grossCredits -
        excludedCredits -
        (withholdBeforeExclusion
          ? grossCredits
          : grossCredits - excludedCredits) *
          withheldFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossCredits: 100,
    excludedCredits: 20,
    withheldFraction: 0.1,
    withholdBeforeExclusion: true,
  },
  output: { withheld: 10, issued: 70 },
} satisfies ToolExample<Input, Output>;
export const carbonBufferWithholdingBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/carbon-buffer-withholding-base",
    title: "Carbon Buffer Withholding Base Tool",
    description:
      "Apply explicit withholding/exclusion order without determining carbon-credit integrity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCredits: { type: "number", minimum: 0 },
        excludedCredits: { type: "number", minimum: 0 },
        withheldFraction: { type: "number", minimum: 0, maximum: 1 },
        withholdBeforeExclusion: { type: "boolean" },
      },
      required: [
        "grossCredits",
        "excludedCredits",
        "withheldFraction",
        "withholdBeforeExclusion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withheld: { type: "number" }, issued: { type: "number" } },
      required: ["withheld", "issued"],
    },
    ports: {
      inputs: [
        {
          id: "grossCredits",
          label: "Gross Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedCredits",
          label: "Excluded Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withheldFraction",
          label: "Withheld Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "withholdBeforeExclusion",
          label: "Withhold Before Exclusion",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "withheld", label: "Withheld", valueType: { type: "number" } },
        { id: "issued", label: "Issued", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = carbonBufferWithholdingBaseTool.execute;
export default carbonBufferWithholdingBaseTool;
