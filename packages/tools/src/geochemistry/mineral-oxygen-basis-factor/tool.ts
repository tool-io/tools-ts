import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredOxygenMoles: number;
  readonly targetOxygenBasis: number;
  readonly cationMoles: number;
};
export type Output = {
  readonly normalizationFactor: number;
  readonly normalizedCations: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredOxygenMoles: { type: "number", exclusiveMinimum: 0 },
    targetOxygenBasis: { type: "number", exclusiveMinimum: 0 },
    cationMoles: { type: "number", minimum: 0 },
  },
  required: ["measuredOxygenMoles", "targetOxygenBasis", "cationMoles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizationFactor: { type: "number" },
    normalizedCations: { type: "number" },
  },
  required: ["normalizationFactor", "normalizedCations"],
} as const;
/** Scale one supplied cation amount to an explicit oxygen basis without determining mineral stoichiometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredOxygenMoles, targetOxygenBasis, cationMoles } = request;
  const compute = (): Output => {
    (H.domain(measuredOxygenMoles > 0, "measuredOxygenMoles"),
      measuredOxygenMoles);
    (H.domain(targetOxygenBasis > 0, "targetOxygenBasis"), targetOxygenBasis);
    H.domain(cationMoles >= 0, "cationMoles");
    return {
      normalizationFactor: targetOxygenBasis / measuredOxygenMoles,
      normalizedCations:
        (cationMoles * targetOxygenBasis) / measuredOxygenMoles,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredOxygenMoles: 3, targetOxygenBasis: 6, cationMoles: 2 },
  output: { normalizationFactor: 2, normalizedCations: 4 },
} satisfies ToolExample<Input, Output>;
export const mineralOxygenBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geochemistry", "chemistry"],
      keywords: ["geochemistry", "chemistry"],
    },
    id: "geochemistry/mineral-oxygen-basis-factor",
    title: "Mineral Oxygen Basis Factor",
    description:
      "Scale one supplied cation amount to an explicit oxygen basis without determining mineral stoichiometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredOxygenMoles: { type: "number", exclusiveMinimum: 0 },
        targetOxygenBasis: { type: "number", exclusiveMinimum: 0 },
        cationMoles: { type: "number", minimum: 0 },
      },
      required: ["measuredOxygenMoles", "targetOxygenBasis", "cationMoles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizationFactor: { type: "number" },
        normalizedCations: { type: "number" },
      },
      required: ["normalizationFactor", "normalizedCations"],
    },
    ports: {
      inputs: [
        {
          id: "measuredOxygenMoles",
          label: "Measured Oxygen Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetOxygenBasis",
          label: "Target Oxygen Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cationMoles",
          label: "Cation Moles",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizationFactor",
          label: "Normalization Factor",
          valueType: { type: "number" },
        },
        {
          id: "normalizedCations",
          label: "Normalized Cations",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mineralOxygenBasisFactorTool.execute;
export default mineralOxygenBasisFactorTool;
