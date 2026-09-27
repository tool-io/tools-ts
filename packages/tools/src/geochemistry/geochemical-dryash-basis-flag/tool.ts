import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryBasisConcentration: number;
  readonly ashFraction: number;
  readonly reportAshBasis: boolean;
};
export type Output = {
  readonly concentration: number;
  readonly factor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryBasisConcentration: { type: "number" },
    ashFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    reportAshBasis: { type: "boolean" },
  },
  required: ["dryBasisConcentration", "ashFraction", "reportAshBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { concentration: { type: "number" }, factor: { type: "number" } },
  required: ["concentration", "factor"],
} as const;
/** Concentration basis crosswalk under a caller-asserted constituent-retained-in-ash assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryBasisConcentration, ashFraction, reportAshBasis } = request;
  const compute = (): Output => {
    H.domain(ashFraction > 0 && ashFraction <= 1);
    return {
      concentration: reportAshBasis
        ? dryBasisConcentration / ashFraction
        : dryBasisConcentration,
      factor: reportAshBasis ? 1 / ashFraction : 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryBasisConcentration: 2, ashFraction: 0.2, reportAshBasis: true },
  output: { concentration: 10, factor: 5 },
} satisfies ToolExample<Input, Output>;
export const geochemicalDryashBasisFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/geochemical-dryash-basis-flag",
    title: "Geochemical Dryash Basis Flag Tool",
    description:
      "Concentration basis crosswalk under a caller-asserted constituent-retained-in-ash assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryBasisConcentration: { type: "number" },
        ashFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        reportAshBasis: { type: "boolean" },
      },
      required: ["dryBasisConcentration", "ashFraction", "reportAshBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number" },
        factor: { type: "number" },
      },
      required: ["concentration", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "dryBasisConcentration",
          label: "Dry Basis Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ashFraction",
          label: "Ash Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "reportAshBasis",
          label: "Report Ash Basis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "concentration",
          label: "Concentration",
          valueType: { type: "number" },
        },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = geochemicalDryashBasisFlagTool.execute;
export default geochemicalDryashBasisFlagTool;
