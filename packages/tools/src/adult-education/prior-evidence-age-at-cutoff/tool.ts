import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly evidenceAt: number; readonly cutoff: number };
export type Output = { readonly age: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { evidenceAt: { type: "number" }, cutoff: { type: "number" } },
  required: ["evidenceAt", "cutoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "number" } },
  required: ["age"],
} as const;
/** Compute supplied prior-learning evidence age without accreditation judgments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evidenceAt, cutoff } = request;
  const compute = (): Output => {
    return { age: cutoff - evidenceAt };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evidenceAt: 10, cutoff: 25 },
  output: { age: 15 },
} satisfies ToolExample<Input, Output>;
export const priorEvidenceAgeAtCutoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/prior-evidence-age-at-cutoff",
    title: "Prior Evidence Age At Cutoff Tool",
    description:
      "Compute supplied prior-learning evidence age without accreditation judgments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidenceAt: { type: "number" },
        cutoff: { type: "number" },
      },
      required: ["evidenceAt", "cutoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { age: { type: "number" } },
      required: ["age"],
    },
    ports: {
      inputs: [
        {
          id: "evidenceAt",
          label: "Evidence At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "age", label: "Age", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = priorEvidenceAgeAtCutoffTool.execute;
export default priorEvidenceAgeAtCutoffTool;
