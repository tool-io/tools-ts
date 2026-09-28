import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly highestElevation: number;
  readonly outletElevation: number;
  readonly basinLength: number;
};
export type Output = { readonly relief: number; readonly reliefRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    highestElevation: { type: "number" },
    outletElevation: { type: "number" },
    basinLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["highestElevation", "outletElevation", "basinLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relief: { type: "number" }, reliefRatio: { type: "number" } },
  required: ["relief", "reliefRatio"],
} as const;
/** Schumm basin relief ratio using basin length and relief in the same length unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { highestElevation, outletElevation, basinLength } = request;
  const compute = (): Output => {
    H.domain(highestElevation >= outletElevation);
    H.positive(basinLength);
    return {
      relief: highestElevation - outletElevation,
      reliefRatio: (highestElevation - outletElevation) / basinLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { highestElevation: 800, outletElevation: 200, basinLength: 10000 },
  output: { relief: 600, reliefRatio: 0.06 },
} satisfies ToolExample<Input, Output>;
export const reliefRatioBasinLengthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/relief-ratio-basin-length-term",
    title: "Relief Ratio Basin Length Term Tool",
    description:
      "Schumm basin relief ratio using basin length and relief in the same length unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        highestElevation: { type: "number" },
        outletElevation: { type: "number" },
        basinLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["highestElevation", "outletElevation", "basinLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relief: { type: "number" },
        reliefRatio: { type: "number" },
      },
      required: ["relief", "reliefRatio"],
    },
    ports: {
      inputs: [
        {
          id: "highestElevation",
          label: "Highest Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletElevation",
          label: "Outlet Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basinLength",
          label: "Basin Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "relief", label: "Relief", valueType: { type: "number" } },
        {
          id: "reliefRatio",
          label: "Relief Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reliefRatioBasinLengthTermTool.execute;
export default reliefRatioBasinLengthTermTool;
