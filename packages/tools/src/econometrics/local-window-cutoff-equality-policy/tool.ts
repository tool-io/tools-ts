import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly runningVariable: number;
  readonly cutoff: number;
  readonly bandwidth: number;
  readonly includeCutoff: boolean;
};
export type Output = {
  readonly distance: number;
  readonly inRightWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runningVariable: { type: "number" },
    cutoff: { type: "number" },
    bandwidth: { type: "number", minimum: 0 },
    includeCutoff: { type: "boolean" },
  },
  required: ["runningVariable", "cutoff", "bandwidth", "includeCutoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    inRightWindow: { type: "boolean" },
  },
  required: ["distance", "inRightWindow"],
} as const;
/** Calculate local window cutoff equality policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runningVariable, cutoff, bandwidth, includeCutoff } = request;
  const compute = (): Output => {
    H.domain(bandwidth >= 0);
    return {
      distance: runningVariable - cutoff,
      inRightWindow:
        (includeCutoff
          ? runningVariable >= cutoff
          : runningVariable > cutoff) && runningVariable - cutoff <= bandwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { runningVariable: 10, cutoff: 10, bandwidth: 2, includeCutoff: true },
  output: { distance: 0, inRightWindow: true },
} satisfies ToolExample<Input, Output>;
export const localWindowCutoffEqualityPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/local-window-cutoff-equality-policy",
    title: "Local Window Cutoff Equality Policy Tool",
    description:
      "Calculate local window cutoff equality policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runningVariable: { type: "number" },
        cutoff: { type: "number" },
        bandwidth: { type: "number", minimum: 0 },
        includeCutoff: { type: "boolean" },
      },
      required: ["runningVariable", "cutoff", "bandwidth", "includeCutoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        inRightWindow: { type: "boolean" },
      },
      required: ["distance", "inRightWindow"],
    },
    ports: {
      inputs: [
        {
          id: "runningVariable",
          label: "Running Variable",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bandwidth",
          label: "Bandwidth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeCutoff",
          label: "Include Cutoff",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        {
          id: "inRightWindow",
          label: "In Right Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = localWindowCutoffEqualityPolicyTool.execute;
export default localWindowCutoffEqualityPolicyTool;
