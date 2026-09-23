import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureLength: number;
  readonly phase: number;
  readonly strand: string;
};
export type Output = { readonly nextPhase: number; readonly phaseAt: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureLength: { type: "integer", minimum: 1 },
    phase: { type: "integer", minimum: 0, maximum: 2 },
    strand: { type: "string", maxLength: 8192, enum: ["+", "-"] },
  },
  required: ["featureLength", "phase", "strand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextPhase: { type: "integer" },
    phaseAt: { type: "string", maxLength: 8192 },
  },
  required: ["nextPhase", "phaseAt"],
} as const;
/** Carry CDS phase along transcript direction using supplied feature length; minus-strand phase is measured from the feature end. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureLength, phase, strand } = request;
  const compute = (): Output => {
    H.integer(featureLength, 1);
    H.integer(phase, 0, 2);
    H.domain(phase <= featureLength && ["+", "-"].includes(strand));
    return {
      nextPhase: (3 - ((featureLength - phase) % 3)) % 3,
      phaseAt: strand === "+" ? "start" : "end",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { featureLength: 10, phase: 0, strand: "+" },
  output: { nextPhase: 2, phaseAt: "start" },
} satisfies ToolExample<Input, Output>;
export const gff3PhaseStrandCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/gff3-phase-strand-carry",
    title: "GFF3 Phase Strand Carry Tool",
    description:
      "Carry CDS phase along transcript direction using supplied feature length; minus-strand phase is measured from the feature end.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureLength: { type: "integer", minimum: 1 },
        phase: { type: "integer", minimum: 0, maximum: 2 },
        strand: { type: "string", maxLength: 8192, enum: ["+", "-"] },
      },
      required: ["featureLength", "phase", "strand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextPhase: { type: "integer" },
        phaseAt: { type: "string", maxLength: 8192 },
      },
      required: ["nextPhase", "phaseAt"],
    },
    ports: {
      inputs: [
        {
          id: "featureLength",
          label: "Feature Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "phase",
          label: "Phase",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "strand",
          label: "Strand",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "nextPhase",
          label: "Next Phase",
          valueType: { type: "integer" },
        },
        { id: "phaseAt", label: "Phase At", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gff3PhaseStrandCarryTool.execute;
export default gff3PhaseStrandCarryTool;
