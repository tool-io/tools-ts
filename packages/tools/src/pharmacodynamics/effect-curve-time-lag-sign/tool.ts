import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseAt: number;
  readonly referenceAt: number;
};
export type Output = { readonly lag: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseAt: { type: "number" },
    referenceAt: { type: "number" },
  },
  required: ["responseAt", "referenceAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lag: { type: "number" }, sign: { type: "integer" } },
  required: ["lag", "sign"],
} as const;
/** Classify an explicit nonclinical response time offset without a causal pharmacodynamic inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseAt, referenceAt } = request;
  const compute = (): Output => {
    return {
      lag: responseAt - referenceAt,
      sign: Math.sign(responseAt - referenceAt),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseAt: 15, referenceAt: 10 },
  output: { lag: 5, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const effectCurveTimeLagSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/effect-curve-time-lag-sign",
    title: "Effect Curve Time Lag Sign Tool",
    description:
      "Classify an explicit nonclinical response time offset without a causal pharmacodynamic inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseAt: { type: "number" },
        referenceAt: { type: "number" },
      },
      required: ["responseAt", "referenceAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lag: { type: "number" }, sign: { type: "integer" } },
      required: ["lag", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "responseAt",
          label: "Response At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAt",
          label: "Reference At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lag", label: "Lag", valueType: { type: "number" } },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = effectCurveTimeLagSignTool.execute;
export default effectCurveTimeLagSignTool;
