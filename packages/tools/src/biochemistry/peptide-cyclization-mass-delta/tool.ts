import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linearMass: number;
  readonly releasedMassPerClosure: number;
  readonly closureCount: number;
  readonly adductDelta: number;
};
export type Output = {
  readonly massDelta: number;
  readonly cyclicMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearMass: { type: "number", minimum: 0 },
    releasedMassPerClosure: { type: "number", minimum: 0 },
    closureCount: { type: "integer", minimum: 0 },
    adductDelta: { type: "number" },
  },
  required: [
    "linearMass",
    "releasedMassPerClosure",
    "closureCount",
    "adductDelta",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massDelta: { type: "number" }, cyclicMass: { type: "number" } },
  required: ["massDelta", "cyclicMass"],
} as const;
/** Formal mass bookkeeping with explicitly supplied closure losses and adduct change; no sequence or reaction procedure is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { linearMass, releasedMassPerClosure, closureCount, adductDelta } =
    request;
  const compute = (): Output => {
    H.domain(linearMass >= 0 && releasedMassPerClosure >= 0);
    H.integer(closureCount, 0);
    return {
      massDelta: -releasedMassPerClosure * closureCount + adductDelta,
      cyclicMass:
        linearMass - releasedMassPerClosure * closureCount + adductDelta,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    linearMass: 1000,
    releasedMassPerClosure: 18,
    closureCount: 1,
    adductDelta: 0,
  },
  output: { massDelta: -18, cyclicMass: 982 },
} satisfies ToolExample<Input, Output>;
export const peptideCyclizationMassDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/peptide-cyclization-mass-delta",
    title: "Peptide Cyclization Mass Delta Tool",
    description:
      "Formal mass bookkeeping with explicitly supplied closure losses and adduct change; no sequence or reaction procedure is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearMass: { type: "number", minimum: 0 },
        releasedMassPerClosure: { type: "number", minimum: 0 },
        closureCount: { type: "integer", minimum: 0 },
        adductDelta: { type: "number" },
      },
      required: [
        "linearMass",
        "releasedMassPerClosure",
        "closureCount",
        "adductDelta",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massDelta: { type: "number" },
        cyclicMass: { type: "number" },
      },
      required: ["massDelta", "cyclicMass"],
    },
    ports: {
      inputs: [
        {
          id: "linearMass",
          label: "Linear Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "releasedMassPerClosure",
          label: "Released Mass Per Closure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closureCount",
          label: "Closure Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "adductDelta",
          label: "Adduct Delta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "massDelta", label: "Mass Delta", valueType: { type: "number" } },
        {
          id: "cyclicMass",
          label: "Cyclic Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = peptideCyclizationMassDeltaTool.execute;
export default peptideCyclizationMassDeltaTool;
