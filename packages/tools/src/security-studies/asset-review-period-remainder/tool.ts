import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastReview: number;
  readonly currentTime: number;
  readonly suppliedPeriod: number;
};
export type Output = {
  readonly elapsed: number;
  readonly remaining: number;
  readonly due: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastReview: { type: "number" },
    currentTime: { type: "number" },
    suppliedPeriod: { type: "number", minimum: 0 },
  },
  required: ["lastReview", "currentTime", "suppliedPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    remaining: { type: "number" },
    due: { type: "boolean" },
  },
  required: ["elapsed", "remaining", "due"],
} as const;
/** Track a caller-supplied administrative asset-review interval without choosing a security standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastReview, currentTime, suppliedPeriod } = request;
  const compute = (): Output => {
    H.domain(suppliedPeriod >= 0);
    return {
      elapsed: currentTime - lastReview,
      remaining: suppliedPeriod - currentTime + lastReview,
      due: currentTime - lastReview >= suppliedPeriod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lastReview: 100, currentTime: 120, suppliedPeriod: 30 },
  output: { elapsed: 20, remaining: 10, due: false },
} satisfies ToolExample<Input, Output>;
export const assetReviewPeriodRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/asset-review-period-remainder",
    title: "Asset Review Period Remainder Tool",
    description:
      "Track a caller-supplied administrative asset-review interval without choosing a security standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastReview: { type: "number" },
        currentTime: { type: "number" },
        suppliedPeriod: { type: "number", minimum: 0 },
      },
      required: ["lastReview", "currentTime", "suppliedPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        remaining: { type: "number" },
        due: { type: "boolean" },
      },
      required: ["elapsed", "remaining", "due"],
    },
    ports: {
      inputs: [
        {
          id: "lastReview",
          label: "Last Review",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentTime",
          label: "Current Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPeriod",
          label: "Supplied Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "due", label: "Due", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = assetReviewPeriodRemainderTool.execute;
export default assetReviewPeriodRemainderTool;
