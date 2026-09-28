import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly positions: number };
export type Output = {
  readonly missing: number;
  readonly meetsMinimum: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { positions: { type: "integer", minimum: 0 } },
  required: ["positions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missing: { type: "integer" },
    meetsMinimum: { type: "boolean" },
  },
  required: ["missing", "meetsMinimum"],
} as const;
/** Calculate polygon ring minimum position budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positions } = request;
  const compute = (): Output => {
    H.integer(positions, 0);
    return {
      missing: Math.max(0, 4 - positions),
      meetsMinimum: positions >= 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { positions: 3 },
  output: { missing: 1, meetsMinimum: false },
} satisfies ToolExample<Input, Output>;
export const polygonRingMinimumPositionBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/polygon-ring-minimum-position-budget",
    title: "Polygon Ring Minimum Position Budget Tool",
    description:
      "Calculate polygon ring minimum position budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { positions: { type: "integer", minimum: 0 } },
      required: ["positions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missing: { type: "integer" },
        meetsMinimum: { type: "boolean" },
      },
      required: ["missing", "meetsMinimum"],
    },
    ports: {
      inputs: [
        {
          id: "positions",
          label: "Positions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "missing", label: "Missing", valueType: { type: "integer" } },
        {
          id: "meetsMinimum",
          label: "Meets Minimum",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = polygonRingMinimumPositionBudgetTool.execute;
export default polygonRingMinimumPositionBudgetTool;
