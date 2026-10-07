import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proteinMassConcentration: number;
  readonly sampleVolume: number;
};
export type Output = { readonly proteinMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proteinMassConcentration: { type: "number", minimum: 0 },
    sampleVolume: { type: "number", minimum: 0 },
  },
  required: ["proteinMassConcentration", "sampleVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { proteinMass: { type: "number" } },
  required: ["proteinMass"],
} as const;
/** Multiply supplied protein mass concentration by sample volume in compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proteinMassConcentration, sampleVolume } = request;
  const compute = (): Output => {
    H.domain(proteinMassConcentration >= 0, "proteinMassConcentration");
    H.domain(sampleVolume >= 0, "sampleVolume");
    return { proteinMass: proteinMassConcentration * sampleVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { proteinMassConcentration: 2, sampleVolume: 3 },
  output: { proteinMass: 6 },
} satisfies ToolExample<Input, Output>;
export const sampleTotalProteinMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/sample-total-protein-mass",
    title: "Sample Total Protein Mass",
    description:
      "Multiply supplied protein mass concentration by sample volume in compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proteinMassConcentration: { type: "number", minimum: 0 },
        sampleVolume: { type: "number", minimum: 0 },
      },
      required: ["proteinMassConcentration", "sampleVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { proteinMass: { type: "number" } },
      required: ["proteinMass"],
    },
    ports: {
      inputs: [
        {
          id: "proteinMassConcentration",
          label: "Protein Mass Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleVolume",
          label: "Sample Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
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
export const run = sampleTotalProteinMassTool.execute;
export default sampleTotalProteinMassTool;
