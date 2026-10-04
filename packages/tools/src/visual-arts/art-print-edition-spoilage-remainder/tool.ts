import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numbered: number;
  readonly proofs: number;
  readonly spoilage: number;
  readonly printed: number;
};
export type Output = {
  readonly requiredGood: number;
  readonly usable: number;
  readonly surplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numbered: { type: "integer", minimum: 0 },
    proofs: { type: "integer", minimum: 0 },
    spoilage: { type: "integer", minimum: 0 },
    printed: { type: "integer", minimum: 0 },
  },
  required: ["numbered", "proofs", "spoilage", "printed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredGood: { type: "integer" },
    usable: { type: "integer" },
    surplus: { type: "integer" },
  },
  required: ["requiredGood", "usable", "surplus"],
} as const;
/** Calculate art print edition spoilage remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numbered, proofs, spoilage, printed } = request;
  const compute = (): Output => {
    H.integer(numbered, 0);
    H.integer(proofs, 0);
    H.integer(printed, 0);
    H.integer(spoilage, 0, printed);
    return {
      requiredGood: numbered + proofs,
      usable: printed - spoilage,
      surplus: printed - spoilage - numbered - proofs,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numbered: 50, proofs: 5, spoilage: 3, printed: 60 },
  output: { requiredGood: 55, usable: 57, surplus: 2 },
} satisfies ToolExample<Input, Output>;
export const artPrintEditionSpoilageRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/art-print-edition-spoilage-remainder",
    title: "Art Print Edition Spoilage Remainder Tool",
    description:
      "Calculate art print edition spoilage remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numbered: { type: "integer", minimum: 0 },
        proofs: { type: "integer", minimum: 0 },
        spoilage: { type: "integer", minimum: 0 },
        printed: { type: "integer", minimum: 0 },
      },
      required: ["numbered", "proofs", "spoilage", "printed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredGood: { type: "integer" },
        usable: { type: "integer" },
        surplus: { type: "integer" },
      },
      required: ["requiredGood", "usable", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "numbered",
          label: "Numbered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "proofs",
          label: "Proofs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "spoilage",
          label: "Spoilage",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "printed",
          label: "Printed",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "requiredGood",
          label: "Required Good",
          valueType: { type: "integer" },
        },
        { id: "usable", label: "Usable", valueType: { type: "integer" } },
        { id: "surplus", label: "Surplus", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = artPrintEditionSpoilageRemainderTool.execute;
export default artPrintEditionSpoilageRemainderTool;
