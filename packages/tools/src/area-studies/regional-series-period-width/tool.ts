import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCoordinate: number;
  readonly lastCoordinate: number;
  readonly inclusive: boolean;
  readonly quantum: number;
};
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCoordinate: { type: "number" },
    lastCoordinate: { type: "number" },
    inclusive: { type: "boolean" },
    quantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstCoordinate", "lastCoordinate", "inclusive", "quantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" } },
  required: ["width"],
} as const;
/** Calculate regional series period width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCoordinate, lastCoordinate, inclusive, quantum } = request;
  const compute = (): Output => {
    H.domain(lastCoordinate >= firstCoordinate);
    H.positive(quantum);
    return {
      width: lastCoordinate - firstCoordinate + (inclusive ? quantum : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCoordinate: 2000,
    lastCoordinate: 2004,
    inclusive: true,
    quantum: 1,
  },
  output: { width: 5 },
} satisfies ToolExample<Input, Output>;
export const regionalSeriesPeriodWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/regional-series-period-width",
    title: "Regional Series Period Width Tool",
    description:
      "Calculate regional series period width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCoordinate: { type: "number" },
        lastCoordinate: { type: "number" },
        inclusive: { type: "boolean" },
        quantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstCoordinate", "lastCoordinate", "inclusive", "quantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" } },
      required: ["width"],
    },
    ports: {
      inputs: [
        {
          id: "firstCoordinate",
          label: "First Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastCoordinate",
          label: "Last Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "width", label: "Width", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = regionalSeriesPeriodWidthTool.execute;
export default regionalSeriesPeriodWidthTool;
