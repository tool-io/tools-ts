import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unrestrictedParameters: number;
  readonly independentRestrictions: number;
};
export type Output = { readonly restrictedParameters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unrestrictedParameters: { type: "integer", minimum: 0 },
    independentRestrictions: { type: "integer", minimum: 0 },
  },
  required: ["unrestrictedParameters", "independentRestrictions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { restrictedParameters: { type: "integer" } },
  required: ["restrictedParameters"],
} as const;
/** Subtract an explicit count of independent parameter restrictions without testing their validity or estimating a model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unrestrictedParameters, independentRestrictions } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(unrestrictedParameters) &&
        unrestrictedParameters >= 0 &&
        unrestrictedParameters <= Number.MAX_SAFE_INTEGER,
      "unrestrictedParameters",
    ),
      unrestrictedParameters);
    (H.domain(
      Number.isSafeInteger(independentRestrictions) &&
        independentRestrictions >= 0 &&
        independentRestrictions <= unrestrictedParameters,
      "independentRestrictions",
    ),
      independentRestrictions);
    return {
      restrictedParameters: unrestrictedParameters - independentRestrictions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unrestrictedParameters: 8, independentRestrictions: 3 },
  output: { restrictedParameters: 5 },
} satisfies ToolExample<Input, Output>;
export const econometricRestrictionDofTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["econometrics", "economics"],
      keywords: ["econometrics", "economics"],
    },
    id: "econometrics/econometric-restriction-dof",
    title: "Econometric Restriction Degrees of Freedom",
    description:
      "Subtract an explicit count of independent parameter restrictions without testing their validity or estimating a model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unrestrictedParameters: { type: "integer", minimum: 0 },
        independentRestrictions: { type: "integer", minimum: 0 },
      },
      required: ["unrestrictedParameters", "independentRestrictions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { restrictedParameters: { type: "integer" } },
      required: ["restrictedParameters"],
    },
    ports: {
      inputs: [
        {
          id: "unrestrictedParameters",
          label: "Unrestricted Parameters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "independentRestrictions",
          label: "Independent Restrictions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "restrictedParameters",
          label: "Restricted Parameters",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = econometricRestrictionDofTool.execute;
export default econometricRestrictionDofTool;
