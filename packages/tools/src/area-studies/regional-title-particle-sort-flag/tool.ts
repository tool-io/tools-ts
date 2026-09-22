import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly title: string;
  readonly particle: string;
  readonly ignoreParticle: boolean;
};
export type Output = {
  readonly sortKey: string;
  readonly particleRemoved: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 8192 },
    particle: { type: "string", maxLength: 8192 },
    ignoreParticle: { type: "boolean" },
  },
  required: ["title", "particle", "ignoreParticle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sortKey: { type: "string", maxLength: 8192 },
    particleRemoved: { type: "boolean" },
  },
  required: ["sortKey", "particleRemoved"],
} as const;
/** Remove only an explicitly supplied leading particle under a caller-defined sort convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { title, particle, ignoreParticle } = request;
  const compute = (): Output => {
    H.domain(particle.length > 0);
    const particleRemoved = ignoreParticle && title.startsWith(particle);
    return {
      sortKey: particleRemoved ? title.slice(particle.length) : title,
      particleRemoved,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { title: "The Archive", particle: "The ", ignoreParticle: true },
  output: { sortKey: "Archive", particleRemoved: true },
} satisfies ToolExample<Input, Output>;
export const regionalTitleParticleSortFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/regional-title-particle-sort-flag",
    title: "Regional Title Particle Sort Flag Tool",
    description:
      "Remove only an explicitly supplied leading particle under a caller-defined sort convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", maxLength: 8192 },
        particle: { type: "string", maxLength: 8192 },
        ignoreParticle: { type: "boolean" },
      },
      required: ["title", "particle", "ignoreParticle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sortKey: { type: "string", maxLength: 8192 },
        particleRemoved: { type: "boolean" },
      },
      required: ["sortKey", "particleRemoved"],
    },
    ports: {
      inputs: [
        {
          id: "title",
          label: "Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "particle",
          label: "Particle",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ignoreParticle",
          label: "Ignore Particle",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "sortKey", label: "Sort Key", valueType: { type: "string" } },
        {
          id: "particleRemoved",
          label: "Particle Removed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = regionalTitleParticleSortFlagTool.execute;
export default regionalTitleParticleSortFlagTool;
