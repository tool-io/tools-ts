import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rate: number;
  readonly elapsed: number;
  readonly plateau: number;
};
export type Output = {
  readonly fraction: number;
  readonly level: number;
  readonly remainingGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rate: { type: "number", minimum: 0 },
    elapsed: { type: "number", minimum: 0 },
    plateau: { type: "number", minimum: 0 },
  },
  required: ["rate", "elapsed", "plateau"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    level: { type: "number" },
    remainingGap: { type: "number" },
  },
  required: ["fraction", "level", "remainingGap"],
} as const;
/** Supplied first-order research approach to a plateau, without infusion-setting advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rate, elapsed, plateau } = request;
  const compute = (): Output => {
    H.domain(rate >= 0 && elapsed >= 0 && plateau >= 0);
    return {
      fraction: -Math.expm1(-rate * elapsed),
      level: plateau * -Math.expm1(-rate * elapsed),
      remainingGap: plateau * Math.exp(-rate * elapsed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rate: 0.5, elapsed: 2, plateau: 10 },
  output: {
    fraction: 0.6321205588285577,
    level: 6.321205588285577,
    remainingGap: 3.6787944117144233,
  },
} satisfies ToolExample<Input, Output>;
export const pkInfusionResearchApproachFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-infusion-research-approach-factor",
    title: "PK Infusion Research Approach Factor Tool",
    description:
      "Supplied first-order research approach to a plateau, without infusion-setting advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rate: { type: "number", minimum: 0 },
        elapsed: { type: "number", minimum: 0 },
        plateau: { type: "number", minimum: 0 },
      },
      required: ["rate", "elapsed", "plateau"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        level: { type: "number" },
        remainingGap: { type: "number" },
      },
      required: ["fraction", "level", "remainingGap"],
    },
    ports: {
      inputs: [
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plateau",
          label: "Plateau",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "level", label: "Level", valueType: { type: "number" } },
        {
          id: "remainingGap",
          label: "Remaining Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkInfusionResearchApproachFactorTool.execute;
export default pkInfusionResearchApproachFactorTool;
