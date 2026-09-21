import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly hydrateWaterFraction: number;
  readonly labeledFraction: number;
  readonly labelIsAnhydrous: boolean;
};
export type Output = {
  readonly anhydrousMass: number;
  readonly impliedComponentMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    hydrateWaterFraction: { type: "number", minimum: 0, maximum: 1 },
    labeledFraction: { type: "number", minimum: 0, maximum: 1 },
    labelIsAnhydrous: { type: "boolean" },
  },
  required: [
    "grossMass",
    "hydrateWaterFraction",
    "labeledFraction",
    "labelIsAnhydrous",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anhydrousMass: { type: "number" },
    impliedComponentMass: { type: "number" },
  },
  required: ["anhydrousMass", "impliedComponentMass"],
} as const;
/** Supplied hydrate/anhydrous mass-label accounting without application-rate or chemical preparation guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, hydrateWaterFraction, labeledFraction, labelIsAnhydrous } =
    request;
  const compute = (): Output => {
    H.domain(grossMass >= 0);
    H.probability(hydrateWaterFraction);
    H.probability(labeledFraction);
    return {
      anhydrousMass: grossMass * (1 - hydrateWaterFraction),
      impliedComponentMass:
        grossMass *
        (labelIsAnhydrous ? 1 - hydrateWaterFraction : 1) *
        labeledFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 100,
    hydrateWaterFraction: 0.2,
    labeledFraction: 0.5,
    labelIsAnhydrous: true,
  },
  output: { anhydrousMass: 80, impliedComponentMass: 40 },
} satisfies ToolExample<Input, Output>;
export const fertilizerHydrateWaterBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/fertilizer-hydrate-water-base-flag",
    title: "Fertilizer Hydrate Water Base Flag Tool",
    description:
      "Supplied hydrate/anhydrous mass-label accounting without application-rate or chemical preparation guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        hydrateWaterFraction: { type: "number", minimum: 0, maximum: 1 },
        labeledFraction: { type: "number", minimum: 0, maximum: 1 },
        labelIsAnhydrous: { type: "boolean" },
      },
      required: [
        "grossMass",
        "hydrateWaterFraction",
        "labeledFraction",
        "labelIsAnhydrous",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anhydrousMass: { type: "number" },
        impliedComponentMass: { type: "number" },
      },
      required: ["anhydrousMass", "impliedComponentMass"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hydrateWaterFraction",
          label: "Hydrate Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labeledFraction",
          label: "Labeled Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelIsAnhydrous",
          label: "Label Is Anhydrous",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "anhydrousMass",
          label: "Anhydrous Mass",
          valueType: { type: "number" },
        },
        {
          id: "impliedComponentMass",
          label: "Implied Component Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fertilizerHydrateWaterBaseFlagTool.execute;
export default fertilizerHydrateWaterBaseFlagTool;
