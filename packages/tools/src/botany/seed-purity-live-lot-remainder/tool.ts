import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotMass: number;
  readonly pureFraction: number;
  readonly viableFraction: number;
};
export type Output = {
  readonly pureLiveMass: number;
  readonly remainderMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotMass: { type: "number", minimum: 0 },
    pureFraction: { type: "number", minimum: 0, maximum: 1 },
    viableFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["lotMass", "pureFraction", "viableFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pureLiveMass: { type: "number" },
    remainderMass: { type: "number" },
  },
  required: ["pureLiveMass", "remainderMass"],
} as const;
/** Compute a pure-live mass equivalent from supplied fractions on compatible mass bases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotMass, pureFraction, viableFraction } = request;
  const compute = (): Output => {
    H.domain(lotMass >= 0);
    H.probability(pureFraction);
    H.probability(viableFraction);
    return {
      pureLiveMass: lotMass * pureFraction * viableFraction,
      remainderMass: lotMass - lotMass * pureFraction * viableFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lotMass: 100, pureFraction: 0.8, viableFraction: 0.5 },
  output: { pureLiveMass: 40, remainderMass: 60 },
} satisfies ToolExample<Input, Output>;
export const seedPurityLiveLotRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/seed-purity-live-lot-remainder",
    title: "Seed Purity Live Lot Remainder Tool",
    description:
      "Compute a pure-live mass equivalent from supplied fractions on compatible mass bases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotMass: { type: "number", minimum: 0 },
        pureFraction: { type: "number", minimum: 0, maximum: 1 },
        viableFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["lotMass", "pureFraction", "viableFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pureLiveMass: { type: "number" },
        remainderMass: { type: "number" },
      },
      required: ["pureLiveMass", "remainderMass"],
    },
    ports: {
      inputs: [
        {
          id: "lotMass",
          label: "Lot Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pureFraction",
          label: "Pure Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "viableFraction",
          label: "Viable Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pureLiveMass",
          label: "Pure Live Mass",
          valueType: { type: "number" },
        },
        {
          id: "remainderMass",
          label: "Remainder Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedPurityLiveLotRemainderTool.execute;
export default seedPurityLiveLotRemainderTool;
