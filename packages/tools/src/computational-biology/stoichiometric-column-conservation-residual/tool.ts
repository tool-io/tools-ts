import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly changes: readonly number[];
  readonly conservedWeights: readonly number[];
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changes: { type: "array", maxItems: 256, items: { type: "number" } },
    conservedWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["changes", "conservedWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Weighted conservation residual for one reaction column, without deriving conserved moieties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { changes, conservedWeights } = request;
  const compute = (): Output => {
    H.sameLength(changes, conservedWeights);
    return { residual: H.dot(changes, conservedWeights) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { changes: [-2, 1], conservedWeights: [1, 2] },
  output: { residual: 0 },
} satisfies ToolExample<Input, Output>;
export const stoichiometricColumnConservationResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-biology/stoichiometric-column-conservation-residual",
      title: "Stoichiometric Column Conservation Residual Tool",
      description:
        "Weighted conservation residual for one reaction column, without deriving conserved moieties.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          changes: { type: "array", maxItems: 256, items: { type: "number" } },
          conservedWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["changes", "conservedWeights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { residual: { type: "number" } },
        required: ["residual"],
      },
      ports: {
        inputs: [
          {
            id: "changes",
            label: "Changes",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "conservedWeights",
            label: "Conserved Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = stoichiometricColumnConservationResidualTool.execute;
export default stoichiometricColumnConservationResidualTool;
