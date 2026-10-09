import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly generations: number;
  readonly effectivePopulationSize: number;
  readonly ploidyMultiplier: number;
};
export type Output = { readonly scaledTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generations: { type: "number", minimum: 0 },
    effectivePopulationSize: { type: "number", exclusiveMinimum: 0 },
    ploidyMultiplier: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["generations", "effectivePopulationSize", "ploidyMultiplier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledTime: { type: "number" } },
  required: ["scaledTime"],
} as const;
/** Scale explicit generations by a caller-supplied effective-population and ploidy convention without estimating either quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { generations, effectivePopulationSize, ploidyMultiplier } = request;
  const compute = (): Output => {
    H.domain(generations >= 0, "generations");
    (H.domain(effectivePopulationSize > 0, "effectivePopulationSize"),
      effectivePopulationSize);
    (H.domain(ploidyMultiplier > 0, "ploidyMultiplier"), ploidyMultiplier);
    const denominator = ploidyMultiplier * effectivePopulationSize;
    return {
      scaledTime:
        denominator > 0 && Number.isFinite(denominator)
          ? generations / denominator
          : generations / effectivePopulationSize / ploidyMultiplier,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    generations: 1000,
    effectivePopulationSize: 10000,
    ploidyMultiplier: 2,
  },
  output: { scaledTime: 0.05 },
} satisfies ToolExample<Input, Output>;
export const coalescentGenerationScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["evolutionary-biology", "evolutionary biology", "biology"],
      keywords: ["evolutionary biology", "biology"],
    },
    id: "evolutionary-biology/coalescent-generation-scale",
    title: "Coalescent Generation Scale",
    description:
      "Scale explicit generations by a caller-supplied effective-population and ploidy convention without estimating either quantity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        generations: { type: "number", minimum: 0 },
        effectivePopulationSize: { type: "number", exclusiveMinimum: 0 },
        ploidyMultiplier: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["generations", "effectivePopulationSize", "ploidyMultiplier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaledTime: { type: "number" } },
      required: ["scaledTime"],
    },
    ports: {
      inputs: [
        {
          id: "generations",
          label: "Generations",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "effectivePopulationSize",
          label: "Effective Population Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ploidyMultiplier",
          label: "Ploidy Multiplier",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledTime",
          label: "Scaled Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coalescentGenerationScaleTool.execute;
export default coalescentGenerationScaleTool;
