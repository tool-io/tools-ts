import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestCoordinate: number;
  readonly latestCoordinate: number;
  readonly endpointsInclusive: boolean;
  readonly quantum: number;
};
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestCoordinate: { type: "number" },
    latestCoordinate: { type: "number" },
    endpointsInclusive: { type: "boolean" },
    quantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "earliestCoordinate",
    "latestCoordinate",
    "endpointsInclusive",
    "quantum",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" } },
  required: ["width"],
} as const;
/** Measure a supplied era-date precision interval with explicit endpoint quantum rather than a calendar lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestCoordinate, latestCoordinate, endpointsInclusive, quantum } =
    request;
  const compute = (): Output => {
    H.domain(latestCoordinate >= earliestCoordinate);
    H.positive(quantum);
    return {
      width:
        latestCoordinate -
        earliestCoordinate +
        (endpointsInclusive ? quantum : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earliestCoordinate: 100,
    latestCoordinate: 109,
    endpointsInclusive: true,
    quantum: 1,
  },
  output: { width: 10 },
} satisfies ToolExample<Input, Output>;
export const publicEraDatePrecisionWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/public-era-date-precision-width",
    title: "Public Era Date Precision Width Tool",
    description:
      "Measure a supplied era-date precision interval with explicit endpoint quantum rather than a calendar lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestCoordinate: { type: "number" },
        latestCoordinate: { type: "number" },
        endpointsInclusive: { type: "boolean" },
        quantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "earliestCoordinate",
        "latestCoordinate",
        "endpointsInclusive",
        "quantum",
      ],
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
          id: "earliestCoordinate",
          label: "Earliest Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestCoordinate",
          label: "Latest Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endpointsInclusive",
          label: "Endpoints Inclusive",
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
export const run = publicEraDatePrecisionWidthTool.execute;
export default publicEraDatePrecisionWidthTool;
