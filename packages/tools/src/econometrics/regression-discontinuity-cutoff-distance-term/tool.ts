import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly runningVariable: number;
  readonly cutoff: number;
  readonly bandwidth: number;
  readonly equalityTreated: boolean;
};
export type Output = {
  readonly distance: number;
  readonly treated: boolean;
  readonly insideBandwidth: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runningVariable: { type: "number" },
    cutoff: { type: "number" },
    bandwidth: { type: "number", minimum: 0 },
    equalityTreated: { type: "boolean" },
  },
  required: ["runningVariable", "cutoff", "bandwidth", "equalityTreated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    treated: { type: "boolean" },
    insideBandwidth: { type: "boolean" },
  },
  required: ["distance", "treated", "insideBandwidth"],
} as const;
/** Explicit assignment and inclusive bandwidth arithmetic; no RD effect or identification claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runningVariable, cutoff, bandwidth, equalityTreated } = request;
  const compute = (): Output => {
    H.domain(bandwidth >= 0);
    return {
      distance: runningVariable - cutoff,
      treated: equalityTreated
        ? runningVariable >= cutoff
        : runningVariable > cutoff,
      insideBandwidth: Math.abs(runningVariable - cutoff) <= bandwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    runningVariable: 52,
    cutoff: 50,
    bandwidth: 5,
    equalityTreated: true,
  },
  output: { distance: 2, treated: true, insideBandwidth: true },
} satisfies ToolExample<Input, Output>;
export const regressionDiscontinuityCutoffDistanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/regression-discontinuity-cutoff-distance-term",
      title: "Regression Discontinuity Cutoff Distance Term Tool",
      description:
        "Explicit assignment and inclusive bandwidth arithmetic; no RD effect or identification claim.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          runningVariable: { type: "number" },
          cutoff: { type: "number" },
          bandwidth: { type: "number", minimum: 0 },
          equalityTreated: { type: "boolean" },
        },
        required: ["runningVariable", "cutoff", "bandwidth", "equalityTreated"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number" },
          treated: { type: "boolean" },
          insideBandwidth: { type: "boolean" },
        },
        required: ["distance", "treated", "insideBandwidth"],
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
            id: "equalityTreated",
            label: "Equality Treated",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "distance", label: "Distance", valueType: { type: "number" } },
          { id: "treated", label: "Treated", valueType: { type: "boolean" } },
          {
            id: "insideBandwidth",
            label: "Inside Bandwidth",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = regressionDiscontinuityCutoffDistanceTermTool.execute;
export default regressionDiscontinuityCutoffDistanceTermTool;
