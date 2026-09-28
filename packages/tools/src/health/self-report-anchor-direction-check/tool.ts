import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerAnchor: string;
  readonly upperAnchor: string;
  readonly expectedLower: string;
  readonly expectedUpper: string;
};
export type Output = { readonly matches: boolean; readonly reversed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerAnchor: { type: "string", maxLength: 8192 },
    upperAnchor: { type: "string", maxLength: 8192 },
    expectedLower: { type: "string", maxLength: 8192 },
    expectedUpper: { type: "string", maxLength: 8192 },
  },
  required: ["lowerAnchor", "upperAnchor", "expectedLower", "expectedUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" }, reversed: { type: "boolean" } },
  required: ["matches", "reversed"],
} as const;
/** Literal anchor-direction check without interpreting a clinical scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerAnchor, upperAnchor, expectedLower, expectedUpper } = request;
  const compute = (): Output => {
    H.domain(expectedLower !== expectedUpper);
    return {
      matches: lowerAnchor === expectedLower && upperAnchor === expectedUpper,
      reversed: lowerAnchor === expectedUpper && upperAnchor === expectedLower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowerAnchor: "never",
    upperAnchor: "always",
    expectedLower: "never",
    expectedUpper: "always",
  },
  output: { matches: true, reversed: false },
} satisfies ToolExample<Input, Output>;
export const selfReportAnchorDirectionCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/self-report-anchor-direction-check",
    title: "Self Report Anchor Direction Check Tool",
    description:
      "Literal anchor-direction check without interpreting a clinical scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerAnchor: { type: "string", maxLength: 8192 },
        upperAnchor: { type: "string", maxLength: 8192 },
        expectedLower: { type: "string", maxLength: 8192 },
        expectedUpper: { type: "string", maxLength: 8192 },
      },
      required: [
        "lowerAnchor",
        "upperAnchor",
        "expectedLower",
        "expectedUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        reversed: { type: "boolean" },
      },
      required: ["matches", "reversed"],
    },
    ports: {
      inputs: [
        {
          id: "lowerAnchor",
          label: "Lower Anchor",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "upperAnchor",
          label: "Upper Anchor",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedLower",
          label: "Expected Lower",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedUpper",
          label: "Expected Upper",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        { id: "reversed", label: "Reversed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = selfReportAnchorDirectionCheckTool.execute;
export default selfReportAnchorDirectionCheckTool;
