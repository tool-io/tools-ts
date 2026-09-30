import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly courtyardLength: number;
  readonly courtyardWidth: number;
  readonly complexFootprint: number;
  readonly arcadeArea: number;
};
export type Output = {
  readonly openArea: number;
  readonly courtyardFraction: number;
  readonly courtyardWithArcadeFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    courtyardLength: { type: "number", minimum: 0 },
    courtyardWidth: { type: "number", minimum: 0 },
    complexFootprint: { type: "number", exclusiveMinimum: 0 },
    arcadeArea: { type: "number", minimum: 0 },
  },
  required: [
    "courtyardLength",
    "courtyardWidth",
    "complexFootprint",
    "arcadeArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openArea: { type: "number" },
    courtyardFraction: { type: "number" },
    courtyardWithArcadeFraction: { type: "number" },
  },
  required: ["openArea", "courtyardFraction", "courtyardWithArcadeFraction"],
} as const;
/** Rectangular courtyard and separate arcade-area proportions within a supplied complex footprint. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { courtyardLength, courtyardWidth, complexFootprint, arcadeArea } =
    request;
  const compute = (): Output => {
    H.domain(
      courtyardLength >= 0 &&
        courtyardWidth >= 0 &&
        arcadeArea >= 0 &&
        courtyardLength * courtyardWidth + arcadeArea <= complexFootprint,
    );
    H.positive(complexFootprint);
    return {
      openArea: courtyardLength * courtyardWidth,
      courtyardFraction: (courtyardLength * courtyardWidth) / complexFootprint,
      courtyardWithArcadeFraction:
        (courtyardLength * courtyardWidth + arcadeArea) / complexFootprint,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    courtyardLength: 20,
    courtyardWidth: 30,
    complexFootprint: 2000,
    arcadeArea: 200,
  },
  output: {
    openArea: 600,
    courtyardFraction: 0.3,
    courtyardWithArcadeFraction: 0.4,
  },
} satisfies ToolExample<Input, Output>;
export const publicIslamicArchitectureCourtyardRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "islamic-studies/public-islamic-architecture-courtyard-ratio",
      title: "Public Islamic Architecture Courtyard Ratio Tool",
      description:
        "Rectangular courtyard and separate arcade-area proportions within a supplied complex footprint.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          courtyardLength: { type: "number", minimum: 0 },
          courtyardWidth: { type: "number", minimum: 0 },
          complexFootprint: { type: "number", exclusiveMinimum: 0 },
          arcadeArea: { type: "number", minimum: 0 },
        },
        required: [
          "courtyardLength",
          "courtyardWidth",
          "complexFootprint",
          "arcadeArea",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openArea: { type: "number" },
          courtyardFraction: { type: "number" },
          courtyardWithArcadeFraction: { type: "number" },
        },
        required: [
          "openArea",
          "courtyardFraction",
          "courtyardWithArcadeFraction",
        ],
      },
      ports: {
        inputs: [
          {
            id: "courtyardLength",
            label: "Courtyard Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "courtyardWidth",
            label: "Courtyard Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "complexFootprint",
            label: "Complex Footprint",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "arcadeArea",
            label: "Arcade Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "openArea", label: "Open Area", valueType: { type: "number" } },
          {
            id: "courtyardFraction",
            label: "Courtyard Fraction",
            valueType: { type: "number" },
          },
          {
            id: "courtyardWithArcadeFraction",
            label: "Courtyard With Arcade Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicIslamicArchitectureCourtyardRatioTool.execute;
export default publicIslamicArchitectureCourtyardRatioTool;
