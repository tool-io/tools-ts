import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly premises: readonly boolean[];
  readonly conclusion: boolean;
};
export type Output = {
  readonly allPremises: boolean;
  readonly countermodel: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premises: { type: "array", maxItems: 256, items: { type: "boolean" } },
    conclusion: { type: "boolean" },
  },
  required: ["premises", "conclusion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allPremises: { type: "boolean" },
    countermodel: { type: "boolean" },
  },
  required: ["allPremises", "countermodel"],
} as const;
/** Identify a countermodel in one assignment; a non-countermodel does not establish global argument validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { premises, conclusion } = request;
  const compute = (): Output => {
    const allPremises = premises.every(Boolean);
    return { allPremises, countermodel: allPremises && !conclusion };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { premises: [true, true], conclusion: false },
  output: { allPremises: true, countermodel: true },
} satisfies ToolExample<Input, Output>;
export const argumentValidityCountermodelOneAssignmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "philosophy/argument-validity-countermodel-one-assignment",
      title: "Argument Validity Countermodel One Assignment Tool",
      description:
        "Identify a countermodel in one assignment; a non-countermodel does not establish global argument validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          premises: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          conclusion: { type: "boolean" },
        },
        required: ["premises", "conclusion"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allPremises: { type: "boolean" },
          countermodel: { type: "boolean" },
        },
        required: ["allPremises", "countermodel"],
      },
      ports: {
        inputs: [
          {
            id: "premises",
            label: "Premises",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "conclusion",
            label: "Conclusion",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "allPremises",
            label: "All Premises",
            valueType: { type: "boolean" },
          },
          {
            id: "countermodel",
            label: "Countermodel",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = argumentValidityCountermodelOneAssignmentTool.execute;
export default argumentValidityCountermodelOneAssignmentTool;
