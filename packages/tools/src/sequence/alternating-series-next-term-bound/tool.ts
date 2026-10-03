import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly partialSum: number;
  readonly nextMagnitude: number;
  readonly nextPositive: boolean;
};
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partialSum: { type: "number" },
    nextMagnitude: { type: "number", minimum: 0 },
    nextPositive: { type: "boolean" },
  },
  required: ["partialSum", "nextMagnitude", "nextPositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
/** Enclose a convergent alternating series assuming subsequent term magnitudes decrease to zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partialSum, nextMagnitude, nextPositive } = request;
  const compute = (): Output => {
    H.domain(nextMagnitude >= 0);
    return {
      lower: nextPositive ? partialSum : partialSum - nextMagnitude,
      upper: nextPositive ? partialSum + nextMagnitude : partialSum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { partialSum: 2, nextMagnitude: 0.1, nextPositive: false },
  output: { lower: 1.9, upper: 2 },
} satisfies ToolExample<Input, Output>;
export const alternatingSeriesNextTermBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/alternating-series-next-term-bound",
    title: "Alternating Series Next Term Bound Tool",
    description:
      "Enclose a convergent alternating series assuming subsequent term magnitudes decrease to zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partialSum: { type: "number" },
        nextMagnitude: { type: "number", minimum: 0 },
        nextPositive: { type: "boolean" },
      },
      required: ["partialSum", "nextMagnitude", "nextPositive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lower: { type: "number" }, upper: { type: "number" } },
      required: ["lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "partialSum",
          label: "Partial Sum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextMagnitude",
          label: "Next Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextPositive",
          label: "Next Positive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = alternatingSeriesNextTermBoundTool.execute;
export default alternatingSeriesNextTermBoundTool;
