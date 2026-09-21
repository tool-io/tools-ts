import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleDryMass: number;
  readonly sampleArea: number;
  readonly targetArea: number;
  readonly suppliedInclusionWeight: number;
};
export type Output = { readonly expandedMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleDryMass: { type: "number", minimum: 0 },
    sampleArea: { type: "number", exclusiveMinimum: 0 },
    targetArea: { type: "number", minimum: 0 },
    suppliedInclusionWeight: { type: "number", minimum: 0 },
  },
  required: [
    "sampleDryMass",
    "sampleArea",
    "targetArea",
    "suppliedInclusionWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expandedMass: { type: "number" } },
  required: ["expandedMass"],
} as const;
/** Expand supplied representative dry-biomass sample mass and an explicit design weight without a species allometry or growth model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleDryMass, sampleArea, targetArea, suppliedInclusionWeight } =
    request;
  const compute = (): Output => {
    H.domain(
      sampleDryMass >= 0 && targetArea >= 0 && suppliedInclusionWeight >= 0,
    );
    H.positive(sampleArea);
    return {
      expandedMass:
        ((sampleDryMass * targetArea) / sampleArea) * suppliedInclusionWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleDryMass: 20,
    sampleArea: 5,
    targetArea: 100,
    suppliedInclusionWeight: 0.5,
  },
  output: { expandedMass: 200 },
} satisfies ToolExample<Input, Output>;
export const woodyBiomassSampleExpansionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/woody-biomass-sample-expansion",
    title: "Woody Biomass Sample Expansion Tool",
    description:
      "Expand supplied representative dry-biomass sample mass and an explicit design weight without a species allometry or growth model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleDryMass: { type: "number", minimum: 0 },
        sampleArea: { type: "number", exclusiveMinimum: 0 },
        targetArea: { type: "number", minimum: 0 },
        suppliedInclusionWeight: { type: "number", minimum: 0 },
      },
      required: [
        "sampleDryMass",
        "sampleArea",
        "targetArea",
        "suppliedInclusionWeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expandedMass: { type: "number" } },
      required: ["expandedMass"],
    },
    ports: {
      inputs: [
        {
          id: "sampleDryMass",
          label: "Sample Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleArea",
          label: "Sample Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetArea",
          label: "Target Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedInclusionWeight",
          label: "Supplied Inclusion Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expandedMass",
          label: "Expanded Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = woodyBiomassSampleExpansionTool.execute;
export default woodyBiomassSampleExpansionTool;
