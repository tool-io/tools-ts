import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly demandByUse: readonly number[];
  readonly coincidentFractions: readonly number[];
  readonly suppliedSpaces: number;
};
export type Output = {
  readonly coincidentDemand: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demandByUse: { type: "array", maxItems: 256, items: { type: "number" } },
    coincidentFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    suppliedSpaces: { type: "integer", minimum: 0 },
  },
  required: ["demandByUse", "coincidentFractions", "suppliedSpaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coincidentDemand: { type: "number" },
    margin: { type: "number" },
  },
  required: ["coincidentDemand", "margin"],
} as const;
/** Apply caller-supplied concurrent peak fractions without choosing parking requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demandByUse, coincidentFractions, suppliedSpaces } = request;
  const compute = (): Output => {
    H.sameLength(demandByUse, coincidentFractions);
    H.integer(suppliedSpaces, 0);
    H.domain(
      demandByUse.every((x) => x >= 0) &&
        coincidentFractions.every((x) => x >= 0 && x <= 1),
    );
    return {
      coincidentDemand: H.dot(demandByUse, coincidentFractions),
      margin: suppliedSpaces - H.dot(demandByUse, coincidentFractions),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    demandByUse: [100, 50],
    coincidentFractions: [0.5, 0.8],
    suppliedSpaces: 100,
  },
  output: { coincidentDemand: 90, margin: 10 },
} satisfies ToolExample<Input, Output>;
export const mixedUseParkingSharedPeakTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/mixed-use-parking-shared-peak-term",
    title: "Mixed Use Parking Shared Peak Term Tool",
    description:
      "Apply caller-supplied concurrent peak fractions without choosing parking requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demandByUse: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        coincidentFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedSpaces: { type: "integer", minimum: 0 },
      },
      required: ["demandByUse", "coincidentFractions", "suppliedSpaces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coincidentDemand: { type: "number" },
        margin: { type: "number" },
      },
      required: ["coincidentDemand", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "demandByUse",
          label: "Demand By Use",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "coincidentFractions",
          label: "Coincident Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedSpaces",
          label: "Supplied Spaces",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "coincidentDemand",
          label: "Coincident Demand",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mixedUseParkingSharedPeakTermTool.execute;
export default mixedUseParkingSharedPeakTermTool;
