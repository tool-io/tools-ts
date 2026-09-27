import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evidenceTrue: boolean;
  readonly claimTrue: boolean;
};
export type Output = {
  readonly countermodel: boolean;
  readonly implicationHoldsHere: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidenceTrue: { type: "boolean" },
    claimTrue: { type: "boolean" },
  },
  required: ["evidenceTrue", "claimTrue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countermodel: { type: "boolean" },
    implicationHoldsHere: { type: "boolean" },
  },
  required: ["countermodel", "implicationHoldsHere"],
} as const;
/** Classical material implication at one valuation; absence of this one countermodel does not prove entailment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evidenceTrue, claimTrue } = request;
  const compute = (): Output => {
    return {
      countermodel: evidenceTrue && !claimTrue,
      implicationHoldsHere: !evidenceTrue || claimTrue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evidenceTrue: true, claimTrue: false },
  output: { countermodel: true, implicationHoldsHere: false },
} satisfies ToolExample<Input, Output>;
export const evidenceEntailmentSingleCountermodelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epistemology/evidence-entailment-single-countermodel",
      title: "Evidence Entailment Single Countermodel Tool",
      description:
        "Classical material implication at one valuation; absence of this one countermodel does not prove entailment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          evidenceTrue: { type: "boolean" },
          claimTrue: { type: "boolean" },
        },
        required: ["evidenceTrue", "claimTrue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          countermodel: { type: "boolean" },
          implicationHoldsHere: { type: "boolean" },
        },
        required: ["countermodel", "implicationHoldsHere"],
      },
      ports: {
        inputs: [
          {
            id: "evidenceTrue",
            label: "Evidence True",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "claimTrue",
            label: "Claim True",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "countermodel",
            label: "Countermodel",
            valueType: { type: "boolean" },
          },
          {
            id: "implicationHoldsHere",
            label: "Implication Holds Here",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = evidenceEntailmentSingleCountermodelTool.execute;
export default evidenceEntailmentSingleCountermodelTool;
