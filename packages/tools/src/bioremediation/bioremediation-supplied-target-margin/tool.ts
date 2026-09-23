import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly target: number;
  readonly uncertainty: number;
};
export type Output = {
  readonly nominalMargin: number;
  readonly conservativeMargin: number;
  readonly definitelyBelow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    target: { type: "number" },
    uncertainty: { type: "number", minimum: 0 },
  },
  required: ["measured", "target", "uncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalMargin: { type: "number" },
    conservativeMargin: { type: "number" },
    definitelyBelow: { type: "boolean" },
  },
  required: ["nominalMargin", "conservativeMargin", "definitelyBelow"],
} as const;
/** Compare supplied observations and bounded uncertainty to an explicit target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, target, uncertainty } = request;
  const compute = (): Output => {
    H.domain(uncertainty >= 0);
    return {
      nominalMargin: target - measured,
      conservativeMargin: target - measured - uncertainty,
      definitelyBelow: measured + uncertainty <= target,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 8, target: 10, uncertainty: 1 },
  output: { nominalMargin: 2, conservativeMargin: 1, definitelyBelow: true },
} satisfies ToolExample<Input, Output>;
export const bioremediationSuppliedTargetMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/bioremediation-supplied-target-margin",
    title: "Bioremediation Supplied Target Margin Tool",
    description:
      "Compare supplied observations and bounded uncertainty to an explicit target.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        target: { type: "number" },
        uncertainty: { type: "number", minimum: 0 },
      },
      required: ["measured", "target", "uncertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalMargin: { type: "number" },
        conservativeMargin: { type: "number" },
        definitelyBelow: { type: "boolean" },
      },
      required: ["nominalMargin", "conservativeMargin", "definitelyBelow"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "uncertainty",
          label: "Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalMargin",
          label: "Nominal Margin",
          valueType: { type: "number" },
        },
        {
          id: "conservativeMargin",
          label: "Conservative Margin",
          valueType: { type: "number" },
        },
        {
          id: "definitelyBelow",
          label: "Definitely Below",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioremediationSuppliedTargetMarginTool.execute;
export default bioremediationSuppliedTargetMarginTool;
