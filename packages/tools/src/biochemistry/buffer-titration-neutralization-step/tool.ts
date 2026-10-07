import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly acidEquivalents: number;
  readonly addedBaseEquivalents: number;
};
export type Output = { readonly remainingAcidEquivalents: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acidEquivalents: { type: "number", minimum: 0 },
    addedBaseEquivalents: { type: "number", minimum: 0 },
  },
  required: ["acidEquivalents", "addedBaseEquivalents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingAcidEquivalents: { type: "number" } },
  required: ["remainingAcidEquivalents"],
} as const;
/** Subtract supplied base equivalents from acid equivalents for a stoichiometric balance without estimating pH. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { acidEquivalents, addedBaseEquivalents } = request;
  const compute = (): Output => {
    H.domain(acidEquivalents >= 0, "acidEquivalents");
    H.domain(addedBaseEquivalents >= 0, "addedBaseEquivalents");
    return { remainingAcidEquivalents: acidEquivalents - addedBaseEquivalents };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { acidEquivalents: 10, addedBaseEquivalents: 4 },
  output: { remainingAcidEquivalents: 6 },
} satisfies ToolExample<Input, Output>;
export const bufferTitrationNeutralizationStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/buffer-titration-neutralization-step",
    title: "Buffer Titration Neutralization Step",
    description:
      "Subtract supplied base equivalents from acid equivalents for a stoichiometric balance without estimating pH.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acidEquivalents: { type: "number", minimum: 0 },
        addedBaseEquivalents: { type: "number", minimum: 0 },
      },
      required: ["acidEquivalents", "addedBaseEquivalents"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingAcidEquivalents: { type: "number" } },
      required: ["remainingAcidEquivalents"],
    },
    ports: {
      inputs: [
        {
          id: "acidEquivalents",
          label: "Acid Equivalents",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedBaseEquivalents",
          label: "Added Base Equivalents",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingAcidEquivalents",
          label: "Remaining Acid Equivalents",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bufferTitrationNeutralizationStepTool.execute;
export default bufferTitrationNeutralizationStepTool;
