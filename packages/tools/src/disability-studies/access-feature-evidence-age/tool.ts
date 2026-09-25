import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evidenceAt: number;
  readonly evaluationAt: number;
};
export type Output = { readonly age: number; readonly futureEvidence: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidenceAt: { type: "number" },
    evaluationAt: { type: "number" },
  },
  required: ["evidenceAt", "evaluationAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "number" }, futureEvidence: { type: "boolean" } },
  required: ["age", "futureEvidence"],
} as const;
/** Calculate access feature evidence age from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evidenceAt, evaluationAt } = request;
  const compute = (): Output => {
    return {
      age: evaluationAt - evidenceAt,
      futureEvidence: evidenceAt > evaluationAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evidenceAt: 10, evaluationAt: 25 },
  output: { age: 15, futureEvidence: false },
} satisfies ToolExample<Input, Output>;
export const accessFeatureEvidenceAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/access-feature-evidence-age",
    title: "Access Feature Evidence Age Tool",
    description:
      "Calculate access feature evidence age from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidenceAt: { type: "number" },
        evaluationAt: { type: "number" },
      },
      required: ["evidenceAt", "evaluationAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        futureEvidence: { type: "boolean" },
      },
      required: ["age", "futureEvidence"],
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
          id: "evaluationAt",
          label: "Evaluation At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "number" } },
        {
          id: "futureEvidence",
          label: "Future Evidence",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = accessFeatureEvidenceAgeTool.execute;
export default accessFeatureEvidenceAgeTool;
