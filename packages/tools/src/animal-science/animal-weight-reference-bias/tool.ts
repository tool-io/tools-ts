import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredMasses: readonly number[];
  readonly referenceMasses: readonly number[];
};
export type Output = {
  readonly meanBias: number;
  readonly relativeAggregateBias: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMasses: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["measuredMasses", "referenceMasses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanBias: { type: "number" },
    relativeAggregateBias: { type: "number" },
  },
  required: ["meanBias", "relativeAggregateBias"],
} as const;
/** Compare paired bench mass measurements and supplied references; no animal-health interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredMasses, referenceMasses } = request;
  const compute = (): Output => {
    H.sameLength(measuredMasses, referenceMasses);
    H.domain(
      measuredMasses.length > 0 &&
        [...measuredMasses, ...referenceMasses].every((x) => x >= 0),
    );
    return (() => {
      const measured = measuredMasses.reduce((a, b) => a + b, 0),
        reference = referenceMasses.reduce((a, b) => a + b, 0);
      H.positive(reference);
      return {
        meanBias: (measured - reference) / measuredMasses.length,
        relativeAggregateBias: (measured - reference) / reference,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredMasses: [11, 21], referenceMasses: [10, 20] },
  output: { meanBias: 1, relativeAggregateBias: 0.06666666666666667 },
} satisfies ToolExample<Input, Output>;
export const animalWeightReferenceBiasTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/animal-weight-reference-bias",
    title: "Animal Weight Reference Bias Tool",
    description:
      "Compare paired bench mass measurements and supplied references; no animal-health interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["measuredMasses", "referenceMasses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanBias: { type: "number" },
        relativeAggregateBias: { type: "number" },
      },
      required: ["meanBias", "relativeAggregateBias"],
    },
    ports: {
      inputs: [
        {
          id: "measuredMasses",
          label: "Measured Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceMasses",
          label: "Reference Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "meanBias", label: "Mean Bias", valueType: { type: "number" } },
        {
          id: "relativeAggregateBias",
          label: "Relative Aggregate Bias",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalWeightReferenceBiasTool.execute;
export default animalWeightReferenceBiasTool;
