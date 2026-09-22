import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offeredMass: number;
  readonly recoveredUneatenMass: number;
  readonly dryFraction: number;
  readonly proteinDryFraction: number;
};
export type Output = {
  readonly ingestedDryMass: number;
  readonly proteinMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offeredMass: { type: "number" },
    recoveredUneatenMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
    proteinDryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "offeredMass",
    "recoveredUneatenMass",
    "dryFraction",
    "proteinDryFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ingestedDryMass: { type: "number" },
    proteinMass: { type: "number" },
  },
  required: ["ingestedDryMass", "proteinMass"],
} as const;
/** Calculate feed protein ingested mass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offeredMass, recoveredUneatenMass, dryFraction, proteinDryFraction } =
    request;
  const compute = (): Output => {
    H.domain(recoveredUneatenMass >= 0 && offeredMass >= recoveredUneatenMass);
    H.probability(dryFraction);
    H.probability(proteinDryFraction);
    return {
      ingestedDryMass: (offeredMass - recoveredUneatenMass) * dryFraction,
      proteinMass:
        (offeredMass - recoveredUneatenMass) * dryFraction * proteinDryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    offeredMass: 100,
    recoveredUneatenMass: 10,
    dryFraction: 0.8,
    proteinDryFraction: 0.5,
  },
  output: { ingestedDryMass: 72, proteinMass: 36 },
} satisfies ToolExample<Input, Output>;
export const feedProteinIngestedMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/feed-protein-ingested-mass-term",
    title: "Feed Protein Ingested Mass Term Tool",
    description:
      "Calculate feed protein ingested mass term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offeredMass: { type: "number" },
        recoveredUneatenMass: { type: "number", minimum: 0 },
        dryFraction: { type: "number", minimum: 0, maximum: 1 },
        proteinDryFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "offeredMass",
        "recoveredUneatenMass",
        "dryFraction",
        "proteinDryFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ingestedDryMass: { type: "number" },
        proteinMass: { type: "number" },
      },
      required: ["ingestedDryMass", "proteinMass"],
    },
    ports: {
      inputs: [
        {
          id: "offeredMass",
          label: "Offered Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredUneatenMass",
          label: "Recovered Uneaten Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proteinDryFraction",
          label: "Protein Dry Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ingestedDryMass",
          label: "Ingested Dry Mass",
          valueType: { type: "number" },
        },
        {
          id: "proteinMass",
          label: "Protein Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedProteinIngestedMassTermTool.execute;
export default feedProteinIngestedMassTermTool;
