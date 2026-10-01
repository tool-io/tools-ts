import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDay: number;
  readonly anchorLowerDay: number;
  readonly anchorUpperDay: number;
};
export type Output = {
  readonly elapsedLower: number;
  readonly elapsedUpper: number;
  readonly exactAnchor: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDay: { type: "number" },
    anchorLowerDay: { type: "number" },
    anchorUpperDay: { type: "number" },
  },
  required: ["observationDay", "anchorLowerDay", "anchorUpperDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedLower: { type: "number" },
    elapsedUpper: { type: "number" },
    exactAnchor: { type: "boolean" },
  },
  required: ["elapsedLower", "elapsedUpper", "exactAnchor"],
} as const;
/** Propagate an already resolved research anchor-date interval without clinical time-origin rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDay, anchorLowerDay, anchorUpperDay } = request;
  const compute = (): Output => {
    H.domain(anchorLowerDay <= anchorUpperDay);
    return {
      elapsedLower: observationDay - anchorUpperDay,
      elapsedUpper: observationDay - anchorLowerDay,
      exactAnchor: anchorLowerDay === anchorUpperDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationDay: 100, anchorLowerDay: 10, anchorUpperDay: 12 },
  output: { elapsedLower: 88, elapsedUpper: 90, exactAnchor: false },
} satisfies ToolExample<Input, Output>;
export const oncologyTimeAnchorPrecisionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/oncology-time-anchor-precision-flag",
    title: "Oncology Time Anchor Precision Flag Tool",
    description:
      "Propagate an already resolved research anchor-date interval without clinical time-origin rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationDay: { type: "number" },
        anchorLowerDay: { type: "number" },
        anchorUpperDay: { type: "number" },
      },
      required: ["observationDay", "anchorLowerDay", "anchorUpperDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedLower: { type: "number" },
        elapsedUpper: { type: "number" },
        exactAnchor: { type: "boolean" },
      },
      required: ["elapsedLower", "elapsedUpper", "exactAnchor"],
    },
    ports: {
      inputs: [
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorLowerDay",
          label: "Anchor Lower Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorUpperDay",
          label: "Anchor Upper Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedLower",
          label: "Elapsed Lower",
          valueType: { type: "number" },
        },
        {
          id: "elapsedUpper",
          label: "Elapsed Upper",
          valueType: { type: "number" },
        },
        {
          id: "exactAnchor",
          label: "Exact Anchor",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = oncologyTimeAnchorPrecisionFlagTool.execute;
export default oncologyTimeAnchorPrecisionFlagTool;
