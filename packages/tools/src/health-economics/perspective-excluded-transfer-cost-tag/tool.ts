import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly costItemId: string;
  readonly suppliedPerspective: string;
  readonly exclusionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costItemId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPerspective: { type: "string", maxLength: 8192, minLength: 1 },
    exclusionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["costItemId", "suppliedPerspective", "exclusionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied cost exclusion and analytic perspective source without deciding which transfers to include. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { costItemId, suppliedPerspective, exclusionSource } = request;
  const compute = (): Output => {
    H.domain(costItemId.length > 0, "costItemId");
    H.domain(suppliedPerspective.length > 0, "suppliedPerspective");
    H.domain(exclusionSource.length > 0, "exclusionSource");
    return {
      token: JSON.stringify([costItemId, suppliedPerspective, exclusionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    costItemId: "C17",
    suppliedPerspective: "societal analysis",
    exclusionSource: "protocol P4",
  },
  output: { token: '["C17","societal analysis","protocol P4"]' },
} satisfies ToolExample<Input, Output>;
export const perspectiveExcludedTransferCostTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/perspective-excluded-transfer-cost-tag",
    title: "Perspective Excluded Transfer Cost Tag Tool",
    description:
      "Record a supplied cost exclusion and analytic perspective source without deciding which transfers to include.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costItemId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPerspective: { type: "string", maxLength: 8192, minLength: 1 },
        exclusionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["costItemId", "suppliedPerspective", "exclusionSource"],
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
          id: "costItemId",
          label: "Cost Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPerspective",
          label: "Supplied Perspective",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exclusionSource",
          label: "Exclusion Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = perspectiveExcludedTransferCostTagTool.execute;
export default perspectiveExcludedTransferCostTagTool;
