import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speciesCount: number;
  readonly assemblageCount: number;
};
export type Output = { readonly relativeAbundance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speciesCount: { type: "integer", minimum: 0 },
    assemblageCount: { type: "integer", minimum: 1 },
  },
  required: ["speciesCount", "assemblageCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeAbundance: { type: "number" } },
  required: ["relativeAbundance"],
} as const;
/** Normalize one recorded species count against a compatible assemblage count without estimating unobserved abundance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speciesCount, assemblageCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(assemblageCount) &&
        assemblageCount >= 1 &&
        assemblageCount <= Number.MAX_SAFE_INTEGER,
      "assemblageCount",
    ),
      assemblageCount);
    (H.domain(
      Number.isSafeInteger(speciesCount) &&
        speciesCount >= 0 &&
        speciesCount <= assemblageCount,
      "speciesCount",
    ),
      speciesCount);
    return { relativeAbundance: speciesCount / assemblageCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speciesCount: 15, assemblageCount: 60 },
  output: { relativeAbundance: 0.25 },
} satisfies ToolExample<Input, Output>;
export const speciesRelativeAbundanceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/species-relative-abundance-share",
    title: "Species Relative Abundance Share",
    description:
      "Normalize one recorded species count against a compatible assemblage count without estimating unobserved abundance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speciesCount: { type: "integer", minimum: 0 },
        assemblageCount: { type: "integer", minimum: 1 },
      },
      required: ["speciesCount", "assemblageCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeAbundance: { type: "number" } },
      required: ["relativeAbundance"],
    },
    ports: {
      inputs: [
        {
          id: "speciesCount",
          label: "Species Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "assemblageCount",
          label: "Assemblage Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "relativeAbundance",
          label: "Relative Abundance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speciesRelativeAbundanceShareTool.execute;
export default speciesRelativeAbundanceShareTool;
