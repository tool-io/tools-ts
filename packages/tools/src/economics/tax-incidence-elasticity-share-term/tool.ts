import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supplyElasticity: number;
  readonly demandElasticityMagnitude: number;
};
export type Output = {
  readonly consumerShare: number;
  readonly producerShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supplyElasticity: { type: "number", minimum: 0 },
    demandElasticityMagnitude: { type: "number", minimum: 0 },
  },
  required: ["supplyElasticity", "demandElasticityMagnitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumerShare: { type: "number" },
    producerShare: { type: "number" },
  },
  required: ["consumerShare", "producerShare"],
} as const;
/** Calculate tax incidence elasticity share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supplyElasticity, demandElasticityMagnitude } = request;
  const compute = (): Output => {
    H.domain(supplyElasticity >= 0 && demandElasticityMagnitude >= 0);
    H.positive(supplyElasticity + demandElasticityMagnitude);
    return {
      consumerShare:
        supplyElasticity / (supplyElasticity + demandElasticityMagnitude),
      producerShare:
        demandElasticityMagnitude /
        (supplyElasticity + demandElasticityMagnitude),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supplyElasticity: 2, demandElasticityMagnitude: 1 },
  output: {
    consumerShare: 0.6666666666666666,
    producerShare: 0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const taxIncidenceElasticityShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/tax-incidence-elasticity-share-term",
    title: "Tax Incidence Elasticity Share Term Tool",
    description:
      "Calculate tax incidence elasticity share term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supplyElasticity: { type: "number", minimum: 0 },
        demandElasticityMagnitude: { type: "number", minimum: 0 },
      },
      required: ["supplyElasticity", "demandElasticityMagnitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumerShare: { type: "number" },
        producerShare: { type: "number" },
      },
      required: ["consumerShare", "producerShare"],
    },
    ports: {
      inputs: [
        {
          id: "supplyElasticity",
          label: "Supply Elasticity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "demandElasticityMagnitude",
          label: "Demand Elasticity Magnitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "consumerShare",
          label: "Consumer Share",
          valueType: { type: "number" },
        },
        {
          id: "producerShare",
          label: "Producer Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxIncidenceElasticityShareTermTool.execute;
export default taxIncidenceElasticityShareTermTool;
