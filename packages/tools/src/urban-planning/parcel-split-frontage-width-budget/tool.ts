import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frontage: number;
  readonly accessWidth: number;
  readonly parcels: number;
};
export type Output = {
  readonly equalFrontage: number;
  readonly totalUsable: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frontage: { type: "number" },
    accessWidth: { type: "number", minimum: 0 },
    parcels: { type: "integer", minimum: 1 },
  },
  required: ["frontage", "accessWidth", "parcels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equalFrontage: { type: "number" },
    totalUsable: { type: "number" },
  },
  required: ["equalFrontage", "totalUsable"],
} as const;
/** Calculate parcel split frontage width budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frontage, accessWidth, parcels } = request;
  const compute = (): Output => {
    H.integer(parcels, 1);
    H.domain(accessWidth >= 0 && frontage >= accessWidth);
    return {
      equalFrontage: (frontage - accessWidth) / parcels,
      totalUsable: frontage - accessWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frontage: 100, accessWidth: 10, parcels: 3 },
  output: { equalFrontage: 30, totalUsable: 90 },
} satisfies ToolExample<Input, Output>;
export const parcelSplitFrontageWidthBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/parcel-split-frontage-width-budget",
    title: "Parcel Split Frontage Width Budget Tool",
    description:
      "Calculate parcel split frontage width budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frontage: { type: "number" },
        accessWidth: { type: "number", minimum: 0 },
        parcels: { type: "integer", minimum: 1 },
      },
      required: ["frontage", "accessWidth", "parcels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equalFrontage: { type: "number" },
        totalUsable: { type: "number" },
      },
      required: ["equalFrontage", "totalUsable"],
    },
    ports: {
      inputs: [
        {
          id: "frontage",
          label: "Frontage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accessWidth",
          label: "Access Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parcels",
          label: "Parcels",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "equalFrontage",
          label: "Equal Frontage",
          valueType: { type: "number" },
        },
        {
          id: "totalUsable",
          label: "Total Usable",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = parcelSplitFrontageWidthBudgetTool.execute;
export default parcelSplitFrontageWidthBudgetTool;
