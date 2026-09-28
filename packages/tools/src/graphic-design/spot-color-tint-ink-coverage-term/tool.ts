import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areas: readonly number[];
  readonly tintFractions: readonly number[];
  readonly wasteFraction: number;
};
export type Output = {
  readonly printedArea: number;
  readonly solidEquivalentArea: number;
  readonly withWaste: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
    tintFractions: { type: "array", maxItems: 256, items: { type: "number" } },
    wasteFraction: { type: "number", minimum: 0 },
  },
  required: ["areas", "tintFractions", "wasteFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    printedArea: { type: "number" },
    solidEquivalentArea: { type: "number" },
    withWaste: { type: "number" },
  },
  required: ["printedArea", "solidEquivalentArea", "withWaste"],
} as const;
/** Area-weighted nominal spot-color solid-equivalent coverage; ink volume, substrate absorption and press gain are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areas, tintFractions, wasteFraction } = request;
  const compute = (): Output => {
    H.sameLength(areas, tintFractions);
    H.domain(
      areas.every((x) => x >= 0) &&
        tintFractions.every((x) => x >= 0 && x <= 1) &&
        wasteFraction >= 0,
    );
    return {
      printedArea: areas.reduce((a, b) => a + b, 0),
      solidEquivalentArea: H.dot(areas, tintFractions),
      withWaste: H.dot(areas, tintFractions) * (1 + wasteFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { areas: [100, 50], tintFractions: [0.5, 0.8], wasteFraction: 0.1 },
  output: {
    printedArea: 150,
    solidEquivalentArea: 90,
    withWaste: 99.00000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const spotColorTintInkCoverageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/spot-color-tint-ink-coverage-term",
    title: "Spot Color Tint Ink Coverage Term Tool",
    description:
      "Area-weighted nominal spot-color solid-equivalent coverage; ink volume, substrate absorption and press gain are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areas: { type: "array", maxItems: 256, items: { type: "number" } },
        tintFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        wasteFraction: { type: "number", minimum: 0 },
      },
      required: ["areas", "tintFractions", "wasteFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        printedArea: { type: "number" },
        solidEquivalentArea: { type: "number" },
        withWaste: { type: "number" },
      },
      required: ["printedArea", "solidEquivalentArea", "withWaste"],
    },
    ports: {
      inputs: [
        {
          id: "areas",
          label: "Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tintFractions",
          label: "Tint Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "wasteFraction",
          label: "Waste Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "printedArea",
          label: "Printed Area",
          valueType: { type: "number" },
        },
        {
          id: "solidEquivalentArea",
          label: "Solid Equivalent Area",
          valueType: { type: "number" },
        },
        { id: "withWaste", label: "With Waste", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = spotColorTintInkCoverageTermTool.execute;
export default spotColorTintInkCoverageTermTool;
