import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly waterMass: number;
  readonly bulkVolume: number;
  readonly reportDry: boolean;
};
export type Output = { readonly massBasis: number; readonly density: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    waterMass: { type: "number", minimum: 0 },
    bulkVolume: { type: "number", exclusiveMinimum: 0 },
    reportDry: { type: "boolean" },
  },
  required: ["wetMass", "waterMass", "bulkVolume", "reportDry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massBasis: { type: "number" }, density: { type: "number" } },
  required: ["massBasis", "density"],
} as const;
/** Calculate sediment bulk density basis flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, waterMass, bulkVolume, reportDry } = request;
  const compute = (): Output => {
    H.positive(bulkVolume);
    H.domain(wetMass >= 0 && waterMass >= 0 && waterMass <= wetMass);
    return {
      massBasis: wetMass - (reportDry ? waterMass : 0),
      density: (wetMass - (reportDry ? waterMass : 0)) / bulkVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, waterMass: 20, bulkVolume: 50, reportDry: true },
  output: { massBasis: 80, density: 1.6 },
} satisfies ToolExample<Input, Output>;
export const sedimentBulkDensityBasisFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/sediment-bulk-density-basis-flag",
    title: "Sediment Bulk Density Basis Flag Tool",
    description:
      "Calculate sediment bulk density basis flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        waterMass: { type: "number", minimum: 0 },
        bulkVolume: { type: "number", exclusiveMinimum: 0 },
        reportDry: { type: "boolean" },
      },
      required: ["wetMass", "waterMass", "bulkVolume", "reportDry"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massBasis: { type: "number" },
        density: { type: "number" },
      },
      required: ["massBasis", "density"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterMass",
          label: "Water Mass",
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
          id: "reportDry",
          label: "Report Dry",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "massBasis", label: "Mass Basis", valueType: { type: "number" } },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sedimentBulkDensityBasisFlagTool.execute;
export default sedimentBulkDensityBasisFlagTool;
