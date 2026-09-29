import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly bulkVolume: number;
  readonly tappedVolume: number;
};
export type Output = {
  readonly bulkDensity: number;
  readonly tappedDensity: number;
  readonly hausnerRatio: number;
  readonly carrIndexPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", exclusiveMinimum: 0 },
    bulkVolume: { type: "number" },
    tappedVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "bulkVolume", "tappedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkDensity: { type: "number" },
    tappedDensity: { type: "number" },
    hausnerRatio: { type: "number" },
    carrIndexPercent: { type: "number" },
  },
  required: [
    "bulkDensity",
    "tappedDensity",
    "hausnerRatio",
    "carrIndexPercent",
  ],
} as const;
/** Compute supplied powder density ratios without choosing flowability categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, bulkVolume, tappedVolume } = request;
  const compute = (): Output => {
    H.positive(mass);
    H.positive(tappedVolume);
    H.domain(bulkVolume >= tappedVolume);
    return {
      bulkDensity: mass / bulkVolume,
      tappedDensity: mass / tappedVolume,
      hausnerRatio: bulkVolume / tappedVolume,
      carrIndexPercent: (100 * (bulkVolume - tappedVolume)) / bulkVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 100, bulkVolume: 200, tappedVolume: 160 },
  output: {
    bulkDensity: 0.5,
    tappedDensity: 0.625,
    hausnerRatio: 1.25,
    carrIndexPercent: 20,
  },
} satisfies ToolExample<Input, Output>;
export const pharmaPowderBulkTappedDensityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/pharma-powder-bulk-tapped-density-gap",
    title: "Pharma Powder Bulk Tapped Density Gap Tool",
    description:
      "Compute supplied powder density ratios without choosing flowability categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", exclusiveMinimum: 0 },
        bulkVolume: { type: "number" },
        tappedVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mass", "bulkVolume", "tappedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bulkDensity: { type: "number" },
        tappedDensity: { type: "number" },
        hausnerRatio: { type: "number" },
        carrIndexPercent: { type: "number" },
      },
      required: [
        "bulkDensity",
        "tappedDensity",
        "hausnerRatio",
        "carrIndexPercent",
      ],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bulkVolume",
          label: "Bulk Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tappedVolume",
          label: "Tapped Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bulkDensity",
          label: "Bulk Density",
          valueType: { type: "number" },
        },
        {
          id: "tappedDensity",
          label: "Tapped Density",
          valueType: { type: "number" },
        },
        {
          id: "hausnerRatio",
          label: "Hausner Ratio",
          valueType: { type: "number" },
        },
        {
          id: "carrIndexPercent",
          label: "Carr Index Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmaPowderBulkTappedDensityGapTool.execute;
export default pharmaPowderBulkTappedDensityGapTool;
