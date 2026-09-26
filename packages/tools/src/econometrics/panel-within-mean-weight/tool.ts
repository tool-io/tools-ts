import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationWeight: number;
  readonly entityTotalWeight: number;
};
export type Output = { readonly withinMeanWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationWeight: { type: "number", minimum: 0 },
    entityTotalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observationWeight", "entityTotalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinMeanWeight: { type: "number" } },
  required: ["withinMeanWeight"],
} as const;
/** Calculate panel within mean weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationWeight, entityTotalWeight } = request;
  const compute = (): Output => {
    H.positive(entityTotalWeight);
    H.domain(observationWeight >= 0 && observationWeight <= entityTotalWeight);
    return { withinMeanWeight: observationWeight / entityTotalWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationWeight: 2, entityTotalWeight: 8 },
  output: { withinMeanWeight: 0.25 },
} satisfies ToolExample<Input, Output>;
export const panelWithinMeanWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/panel-within-mean-weight",
    title: "Panel Within Mean Weight Tool",
    description:
      "Calculate panel within mean weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationWeight: { type: "number", minimum: 0 },
        entityTotalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observationWeight", "entityTotalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinMeanWeight: { type: "number" } },
      required: ["withinMeanWeight"],
    },
    ports: {
      inputs: [
        {
          id: "observationWeight",
          label: "Observation Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "entityTotalWeight",
          label: "Entity Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "withinMeanWeight",
          label: "Within Mean Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = panelWithinMeanWeightTool.execute;
export default panelWithinMeanWeightTool;
