import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freshInertFlow: number;
  readonly loopFlow: number;
  readonly purgeFraction: number;
};
export type Output = {
  readonly purgeFlow: number;
  readonly inertFraction: number;
  readonly physicallyPossible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freshInertFlow: { type: "number", minimum: 0 },
    loopFlow: { type: "number", exclusiveMinimum: 0 },
    purgeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["freshInertFlow", "loopFlow", "purgeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purgeFlow: { type: "number" },
    inertFraction: { type: "number" },
    physicallyPossible: { type: "boolean" },
  },
  required: ["purgeFlow", "inertFraction", "physicallyPossible"],
} as const;
/** Nonreacting inert steady balance with only the explicit purge removing inert; out-of-range fractions expose inconsistent flow inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freshInertFlow, loopFlow, purgeFraction } = request;
  const compute = (): Output => {
    H.domain(freshInertFlow >= 0 && purgeFraction > 0 && purgeFraction <= 1);
    H.positive(loopFlow);
    return {
      purgeFlow: loopFlow * purgeFraction,
      inertFraction: freshInertFlow / (loopFlow * purgeFraction),
      physicallyPossible: freshInertFlow <= loopFlow * purgeFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freshInertFlow: 2, loopFlow: 100, purgeFraction: 0.1 },
  output: { purgeFlow: 10, inertFraction: 0.2, physicallyPossible: true },
} satisfies ToolExample<Input, Output>;
export const recyclePurgeInertSteadyFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/recycle-purge-inert-steady-fraction",
    title: "Recycle Purge Inert Steady Fraction Tool",
    description:
      "Nonreacting inert steady balance with only the explicit purge removing inert; out-of-range fractions expose inconsistent flow inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freshInertFlow: { type: "number", minimum: 0 },
        loopFlow: { type: "number", exclusiveMinimum: 0 },
        purgeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["freshInertFlow", "loopFlow", "purgeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purgeFlow: { type: "number" },
        inertFraction: { type: "number" },
        physicallyPossible: { type: "boolean" },
      },
      required: ["purgeFlow", "inertFraction", "physicallyPossible"],
    },
    ports: {
      inputs: [
        {
          id: "freshInertFlow",
          label: "Fresh Inert Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loopFlow",
          label: "Loop Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purgeFraction",
          label: "Purge Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "purgeFlow", label: "Purge Flow", valueType: { type: "number" } },
        {
          id: "inertFraction",
          label: "Inert Fraction",
          valueType: { type: "number" },
        },
        {
          id: "physicallyPossible",
          label: "Physically Possible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = recyclePurgeInertSteadyFractionTool.execute;
export default recyclePurgeInertSteadyFractionTool;
