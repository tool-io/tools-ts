import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiryLower: number;
  readonly expiryUpper: number;
  readonly checkDay: number;
};
export type Output = {
  readonly definitelyBeforeExpiry: boolean;
  readonly definitelyAfterExpiry: boolean;
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryLower: { type: "integer" },
    expiryUpper: { type: "integer" },
    checkDay: { type: "integer" },
  },
  required: ["expiryLower", "expiryUpper", "checkDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    definitelyBeforeExpiry: { type: "boolean" },
    definitelyAfterExpiry: { type: "boolean" },
    ambiguous: { type: "boolean" },
  },
  required: ["definitelyBeforeExpiry", "definitelyAfterExpiry", "ambiguous"],
} as const;
/** Compare a supplied day against an uncertain expiry boundary without deciding reagent usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiryLower, expiryUpper, checkDay } = request;
  const compute = (): Output => {
    H.domain(expiryLower <= expiryUpper);
    return {
      definitelyBeforeExpiry: checkDay < expiryLower,
      definitelyAfterExpiry: checkDay > expiryUpper,
      ambiguous: checkDay >= expiryLower && checkDay <= expiryUpper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expiryLower: 100, expiryUpper: 130, checkDay: 120 },
  output: {
    definitelyBeforeExpiry: false,
    definitelyAfterExpiry: false,
    ambiguous: true,
  },
} satisfies ToolExample<Input, Output>;
export const glpReagentExpiryPrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-reagent-expiry-precision",
    title: "GLP Reagent Expiry Precision Tool",
    description:
      "Compare a supplied day against an uncertain expiry boundary without deciding reagent usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryLower: { type: "integer" },
        expiryUpper: { type: "integer" },
        checkDay: { type: "integer" },
      },
      required: ["expiryLower", "expiryUpper", "checkDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        definitelyBeforeExpiry: { type: "boolean" },
        definitelyAfterExpiry: { type: "boolean" },
        ambiguous: { type: "boolean" },
      },
      required: [
        "definitelyBeforeExpiry",
        "definitelyAfterExpiry",
        "ambiguous",
      ],
    },
    ports: {
      inputs: [
        {
          id: "expiryLower",
          label: "Expiry Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expiryUpper",
          label: "Expiry Upper",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "checkDay",
          label: "Check Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "definitelyBeforeExpiry",
          label: "Definitely Before Expiry",
          valueType: { type: "boolean" },
        },
        {
          id: "definitelyAfterExpiry",
          label: "Definitely After Expiry",
          valueType: { type: "boolean" },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = glpReagentExpiryPrecisionTool.execute;
export default glpReagentExpiryPrecisionTool;
