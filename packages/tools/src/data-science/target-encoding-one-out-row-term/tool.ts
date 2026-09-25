import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupSum: number;
  readonly groupCount: number;
  readonly rowTarget: number;
  readonly priorMean: number;
  readonly smoothing: number;
};
export type Output = {
  readonly remainingCount: number;
  readonly encoded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupSum: { type: "number" },
    groupCount: { type: "integer", minimum: 1 },
    rowTarget: { type: "number" },
    priorMean: { type: "number" },
    smoothing: { type: "number", minimum: 0 },
  },
  required: ["groupSum", "groupCount", "rowTarget", "priorMean", "smoothing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingCount: { type: "integer" },
    encoded: { type: "number" },
  },
  required: ["remainingCount", "encoded"],
} as const;
/** Leave-one-out target mean with explicit prior pseudo-count; group sum includes the held-out row. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupSum, groupCount, rowTarget, priorMean, smoothing } = request;
  const compute = (): Output => {
    H.integer(groupCount, 1);
    H.domain(smoothing >= 0 && groupCount - 1 + smoothing > 0);
    return {
      remainingCount: groupCount - 1,
      encoded:
        (groupSum - rowTarget + smoothing * priorMean) /
        (groupCount - 1 + smoothing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    groupSum: 20,
    groupCount: 4,
    rowTarget: 8,
    priorMean: 3,
    smoothing: 1,
  },
  output: { remainingCount: 3, encoded: 3.75 },
} satisfies ToolExample<Input, Output>;
export const targetEncodingOneOutRowTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/target-encoding-one-out-row-term",
    title: "Target Encoding One Out Row Term Tool",
    description:
      "Leave-one-out target mean with explicit prior pseudo-count; group sum includes the held-out row.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupSum: { type: "number" },
        groupCount: { type: "integer", minimum: 1 },
        rowTarget: { type: "number" },
        priorMean: { type: "number" },
        smoothing: { type: "number", minimum: 0 },
      },
      required: [
        "groupSum",
        "groupCount",
        "rowTarget",
        "priorMean",
        "smoothing",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingCount: { type: "integer" },
        encoded: { type: "number" },
      },
      required: ["remainingCount", "encoded"],
    },
    ports: {
      inputs: [
        {
          id: "groupSum",
          label: "Group Sum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groupCount",
          label: "Group Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowTarget",
          label: "Row Target",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorMean",
          label: "Prior Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "smoothing",
          label: "Smoothing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingCount",
          label: "Remaining Count",
          valueType: { type: "integer" },
        },
        { id: "encoded", label: "Encoded", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = targetEncodingOneOutRowTermTool.execute;
export default targetEncodingOneOutRowTermTool;
