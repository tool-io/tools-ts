import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly runningVariable: number;
  readonly cutoff: number;
  readonly includeCutoffInAbove: boolean;
};
export type Output = {
  readonly centeredRunningVariable: number;
  readonly atOrAboveUnderPolicy: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runningVariable: { type: "number" },
    cutoff: { type: "number" },
    includeCutoffInAbove: { type: "boolean" },
  },
  required: ["runningVariable", "cutoff", "includeCutoffInAbove"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centeredRunningVariable: { type: "number" },
    atOrAboveUnderPolicy: { type: "boolean" },
  },
  required: ["centeredRunningVariable", "atOrAboveUnderPolicy"],
} as const;
/** Center an explicit running variable and apply a supplied cutoff equality convention without choosing an RD bandwidth or identifying a causal effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runningVariable, cutoff, includeCutoffInAbove } = request;
  const compute = (): Output => {
    return {
      centeredRunningVariable: runningVariable - cutoff,
      atOrAboveUnderPolicy:
        runningVariable > cutoff ||
        (runningVariable === cutoff && includeCutoffInAbove),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { runningVariable: 55, cutoff: 50, includeCutoffInAbove: true },
  output: { centeredRunningVariable: 5, atOrAboveUnderPolicy: true },
} satisfies ToolExample<Input, Output>;
export const regressionDiscontinuityRunningVariableCenterTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["econometrics", "economics"],
        keywords: ["econometrics", "economics"],
      },
      id: "econometrics/regression-discontinuity-running-variable-center",
      title: "Regression Discontinuity Running Variable Center",
      description:
        "Center an explicit running variable and apply a supplied cutoff equality convention without choosing an RD bandwidth or identifying a causal effect.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          runningVariable: { type: "number" },
          cutoff: { type: "number" },
          includeCutoffInAbove: { type: "boolean" },
        },
        required: ["runningVariable", "cutoff", "includeCutoffInAbove"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          centeredRunningVariable: { type: "number" },
          atOrAboveUnderPolicy: { type: "boolean" },
        },
        required: ["centeredRunningVariable", "atOrAboveUnderPolicy"],
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
            id: "includeCutoffInAbove",
            label: "Include Cutoff In Above",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "centeredRunningVariable",
            label: "Centered Running Variable",
            valueType: { type: "number" },
          },
          {
            id: "atOrAboveUnderPolicy",
            label: "At Or Above Under Policy",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = regressionDiscontinuityRunningVariableCenterTool.execute;
export default regressionDiscontinuityRunningVariableCenterTool;
