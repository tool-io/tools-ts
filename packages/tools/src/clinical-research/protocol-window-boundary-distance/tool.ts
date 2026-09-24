import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedAt: number;
  readonly lower: number;
  readonly upper: number;
  readonly inclusiveUpper: boolean;
};
export type Output = {
  readonly lowerDistance: number;
  readonly upperDistance: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedAt: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    inclusiveUpper: { type: "boolean" },
  },
  required: ["observedAt", "lower", "upper", "inclusiveUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerDistance: { type: "number" },
    upperDistance: { type: "number" },
    withinWindow: { type: "boolean" },
  },
  required: ["lowerDistance", "upperDistance", "withinWindow"],
} as const;
/** Compare supplied research schedule coordinates with explicit endpoint rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedAt, lower, upper, inclusiveUpper } = request;
  const compute = (): Output => {
    H.domain(upper >= lower);
    return {
      lowerDistance: observedAt - lower,
      upperDistance: upper - observedAt,
      withinWindow:
        observedAt >= lower &&
        (inclusiveUpper ? observedAt <= upper : observedAt < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedAt: 15, lower: 10, upper: 20, inclusiveUpper: true },
  output: { lowerDistance: 5, upperDistance: 5, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const protocolWindowBoundaryDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/protocol-window-boundary-distance",
    title: "Protocol Window Boundary Distance Tool",
    description:
      "Compare supplied research schedule coordinates with explicit endpoint rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedAt: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        inclusiveUpper: { type: "boolean" },
      },
      required: ["observedAt", "lower", "upper", "inclusiveUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerDistance: { type: "number" },
        upperDistance: { type: "number" },
        withinWindow: { type: "boolean" },
      },
      required: ["lowerDistance", "upperDistance", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "observedAt",
          label: "Observed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusiveUpper",
          label: "Inclusive Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lowerDistance",
          label: "Lower Distance",
          valueType: { type: "number" },
        },
        {
          id: "upperDistance",
          label: "Upper Distance",
          valueType: { type: "number" },
        },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = protocolWindowBoundaryDistanceTool.execute;
export default protocolWindowBoundaryDistanceTool;
