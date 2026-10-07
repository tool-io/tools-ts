import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dependentUnit: string;
  readonly independentUnit: string;
  readonly derivativeOrderText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dependentUnit: { type: "string", maxLength: 8192, minLength: 1 },
    independentUnit: { type: "string", maxLength: 8192, minLength: 1 },
    derivativeOrderText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["dependentUnit", "independentUnit", "derivativeOrderText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit derivative unit-ratio record by order text without simplifying units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dependentUnit, independentUnit, derivativeOrderText } = request;
  const compute = (): Output => {
    H.domain(dependentUnit.length > 0, "dependentUnit");
    H.domain(independentUnit.length > 0, "independentUnit");
    H.domain(derivativeOrderText.length > 0, "derivativeOrderText");
    return {
      token: JSON.stringify([
        dependentUnit,
        independentUnit,
        derivativeOrderText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dependentUnit: "m", independentUnit: "s", derivativeOrderText: "1" },
  output: { token: '["m","s","1"]' },
} satisfies ToolExample<Input, Output>;
export const derivativeUnitRatioLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["calculus", "mathematics"],
      keywords: ["calculus", "mathematics"],
    },
    id: "calculus/derivative-unit-ratio-label",
    title: "Derivative Unit Ratio Label",
    description:
      "Qualify an explicit derivative unit-ratio record by order text without simplifying units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dependentUnit: { type: "string", maxLength: 8192, minLength: 1 },
        independentUnit: { type: "string", maxLength: 8192, minLength: 1 },
        derivativeOrderText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["dependentUnit", "independentUnit", "derivativeOrderText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "dependentUnit",
          label: "Dependent Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "independentUnit",
          label: "Independent Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "derivativeOrderText",
          label: "Derivative Order Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = derivativeUnitRatioLabelTool.execute;
export default derivativeUnitRatioLabelTool;
