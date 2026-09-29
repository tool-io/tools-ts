import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalArea: number;
  readonly openings: readonly number[];
  readonly overlappingArea: number;
};
export type Output = {
  readonly openArea: number;
  readonly coveredFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number", exclusiveMinimum: 0 },
    openings: { type: "array", maxItems: 256, items: { type: "number" } },
    overlappingArea: { type: "number", minimum: 0 },
  },
  required: ["totalArea", "openings", "overlappingArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openArea: { type: "number" },
    coveredFraction: { type: "number" },
  },
  required: ["openArea", "coveredFraction"],
} as const;
/** Calculate reservoir cover open area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalArea, openings, overlappingArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(
      openings.every((x) => x >= 0) &&
        overlappingArea >= 0 &&
        overlappingArea <= openings.reduce((a, b) => a + b, 0) &&
        openings.reduce((a, b) => a + b, 0) - overlappingArea <= totalArea,
    );
    return {
      openArea: openings.reduce((a, b) => a + b, 0) - overlappingArea,
      coveredFraction:
        1 - (openings.reduce((a, b) => a + b, 0) - overlappingArea) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalArea: 100, openings: [10, 20], overlappingArea: 5 },
  output: { openArea: 25, coveredFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const reservoirCoverOpenAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/reservoir-cover-open-area-share",
    title: "Reservoir Cover Open Area Share Tool",
    description:
      "Calculate reservoir cover open area share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number", exclusiveMinimum: 0 },
        openings: { type: "array", maxItems: 256, items: { type: "number" } },
        overlappingArea: { type: "number", minimum: 0 },
      },
      required: ["totalArea", "openings", "overlappingArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openArea: { type: "number" },
        coveredFraction: { type: "number" },
      },
      required: ["openArea", "coveredFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openings",
          label: "Openings",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "overlappingArea",
          label: "Overlapping Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "openArea", label: "Open Area", valueType: { type: "number" } },
        {
          id: "coveredFraction",
          label: "Covered Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservoirCoverOpenAreaShareTool.execute;
export default reservoirCoverOpenAreaShareTool;
