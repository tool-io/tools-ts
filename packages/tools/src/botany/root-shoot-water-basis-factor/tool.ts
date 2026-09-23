import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rootWet: number;
  readonly shootWet: number;
  readonly rootWaterFraction: number;
  readonly shootWaterFraction: number;
};
export type Output = {
  readonly rootDry: number;
  readonly shootDry: number;
  readonly dryRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rootWet: { type: "number", minimum: 0 },
    shootWet: { type: "number", exclusiveMinimum: 0 },
    rootWaterFraction: { type: "number", minimum: 0, maximum: 1 },
    shootWaterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["rootWet", "shootWet", "rootWaterFraction", "shootWaterFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rootDry: { type: "number" },
    shootDry: { type: "number" },
    dryRatio: { type: "number" },
  },
  required: ["rootDry", "shootDry", "dryRatio"],
} as const;
/** Convert wet masses to dry masses from supplied wet-basis water fractions before taking their ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rootWet, shootWet, rootWaterFraction, shootWaterFraction } = request;
  const compute = (): Output => {
    H.domain(rootWet >= 0);
    H.positive(shootWet);
    H.probability(rootWaterFraction);
    H.domain(shootWaterFraction >= 0 && shootWaterFraction < 1);
    return {
      rootDry: rootWet * (1 - rootWaterFraction),
      shootDry: shootWet * (1 - shootWaterFraction),
      dryRatio:
        (rootWet * (1 - rootWaterFraction)) /
        (shootWet * (1 - shootWaterFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rootWet: 10,
    shootWet: 20,
    rootWaterFraction: 0.5,
    shootWaterFraction: 0.75,
  },
  output: { rootDry: 5, shootDry: 5, dryRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const rootShootWaterBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/root-shoot-water-basis-factor",
    title: "Root Shoot Water Basis Factor Tool",
    description:
      "Convert wet masses to dry masses from supplied wet-basis water fractions before taking their ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rootWet: { type: "number", minimum: 0 },
        shootWet: { type: "number", exclusiveMinimum: 0 },
        rootWaterFraction: { type: "number", minimum: 0, maximum: 1 },
        shootWaterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: [
        "rootWet",
        "shootWet",
        "rootWaterFraction",
        "shootWaterFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rootDry: { type: "number" },
        shootDry: { type: "number" },
        dryRatio: { type: "number" },
      },
      required: ["rootDry", "shootDry", "dryRatio"],
    },
    ports: {
      inputs: [
        {
          id: "rootWet",
          label: "Root Wet",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shootWet",
          label: "Shoot Wet",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rootWaterFraction",
          label: "Root Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shootWaterFraction",
          label: "Shoot Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rootDry", label: "Root Dry", valueType: { type: "number" } },
        { id: "shootDry", label: "Shoot Dry", valueType: { type: "number" } },
        { id: "dryRatio", label: "Dry Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rootShootWaterBasisFactorTool.execute;
export default rootShootWaterBasisFactorTool;
