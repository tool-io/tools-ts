import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startReading: number;
  readonly endReading: number;
  readonly resetOccurred: boolean;
  readonly postResetReading: number;
};
export type Output = { readonly depth: number; readonly usedReset: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startReading: { type: "number" },
    endReading: { type: "number" },
    resetOccurred: { type: "boolean" },
    postResetReading: { type: "number" },
  },
  required: ["startReading", "endReading", "resetOccurred", "postResetReading"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "number" }, usedReset: { type: "boolean" } },
  required: ["depth", "usedReset"],
} as const;
/** Compute an explicit nonnegative gauge increment; a declared reset uses caller-supplied post-reset accumulation only. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startReading, endReading, resetOccurred, postResetReading } = request;
  const compute = (): Output => {
    H.domain(
      startReading >= 0 &&
        endReading >= 0 &&
        postResetReading >= 0 &&
        (resetOccurred || endReading >= startReading),
    );
    return {
      depth: resetOccurred ? postResetReading : endReading - startReading,
      usedReset: resetOccurred,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startReading: 10,
    endReading: 15,
    resetOccurred: false,
    postResetReading: 0,
  },
  output: { depth: 5, usedReset: false },
} satisfies ToolExample<Input, Output>;
export const gaugeAccumulationIntervalDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/gauge-accumulation-interval-depth",
    title: "Gauge Accumulation Interval Depth Tool",
    description:
      "Compute an explicit nonnegative gauge increment; a declared reset uses caller-supplied post-reset accumulation only.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startReading: { type: "number" },
        endReading: { type: "number" },
        resetOccurred: { type: "boolean" },
        postResetReading: { type: "number" },
      },
      required: [
        "startReading",
        "endReading",
        "resetOccurred",
        "postResetReading",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depth: { type: "number" }, usedReset: { type: "boolean" } },
      required: ["depth", "usedReset"],
    },
    ports: {
      inputs: [
        {
          id: "startReading",
          label: "Start Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endReading",
          label: "End Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resetOccurred",
          label: "Reset Occurred",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "postResetReading",
          label: "Post Reset Reading",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "number" } },
        {
          id: "usedReset",
          label: "Used Reset",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaugeAccumulationIntervalDepthTool.execute;
export default gaugeAccumulationIntervalDepthTool;
