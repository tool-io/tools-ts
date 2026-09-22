import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly extinctionPerBase: number;
  readonly concentration: number;
  readonly pathLength: number;
};
export type Output = {
  readonly extinctionContribution: number;
  readonly absorbanceContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    extinctionPerBase: { type: "number", minimum: 0 },
    concentration: { type: "number", minimum: 0 },
    pathLength: { type: "number", minimum: 0 },
  },
  required: ["count", "extinctionPerBase", "concentration", "pathLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extinctionContribution: { type: "number" },
    absorbanceContribution: { type: "number" },
  },
  required: ["extinctionContribution", "absorbanceContribution"],
} as const;
/** Additive one-base extinction approximation; does not apply nearest-neighbor or sequence hypochromicity corrections. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, extinctionPerBase, concentration, pathLength } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.domain(extinctionPerBase >= 0 && concentration >= 0 && pathLength >= 0);
    return {
      extinctionContribution: count * extinctionPerBase,
      absorbanceContribution:
        count * extinctionPerBase * concentration * pathLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    count: 10,
    extinctionPerBase: 10000,
    concentration: 0.000001,
    pathLength: 1,
  },
  output: {
    extinctionContribution: 100000,
    absorbanceContribution: 0.09999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const nucleotideExtinctionOneBaseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/nucleotide-extinction-one-base-term",
    title: "Nucleotide Extinction One Base Term Tool",
    description:
      "Additive one-base extinction approximation; does not apply nearest-neighbor or sequence hypochromicity corrections.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        extinctionPerBase: { type: "number", minimum: 0 },
        concentration: { type: "number", minimum: 0 },
        pathLength: { type: "number", minimum: 0 },
      },
      required: ["count", "extinctionPerBase", "concentration", "pathLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extinctionContribution: { type: "number" },
        absorbanceContribution: { type: "number" },
      },
      required: ["extinctionContribution", "absorbanceContribution"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "extinctionPerBase",
          label: "Extinction Per Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathLength",
          label: "Path Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "extinctionContribution",
          label: "Extinction Contribution",
          valueType: { type: "number" },
        },
        {
          id: "absorbanceContribution",
          label: "Absorbance Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nucleotideExtinctionOneBaseTermTool.execute;
export default nucleotideExtinctionOneBaseTermTool;
