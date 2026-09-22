import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responses: number;
  readonly opportunities: number;
};
export type Output = { readonly defined: boolean; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responses: { type: "integer", minimum: 0 },
    opportunities: { type: "integer", minimum: 0 },
  },
  required: ["responses", "opportunities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, share: { type: "number" } },
  required: ["defined", "share"],
} as const;
/** Calculate response opportunity zero denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responses, opportunities } = request;
  const compute = (): Output => {
    H.integer(opportunities, 0);
    H.integer(responses, 0, opportunities);
    return {
      defined: opportunities > 0,
      share: opportunities > 0 ? responses / opportunities : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responses: 0, opportunities: 0 },
  output: { defined: false, share: 0 },
} satisfies ToolExample<Input, Output>;
export const responseOpportunityZeroDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/response-opportunity-zero-denominator",
    title: "Response Opportunity Zero Denominator Tool",
    description:
      "Calculate response opportunity zero denominator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responses: { type: "integer", minimum: 0 },
        opportunities: { type: "integer", minimum: 0 },
      },
      required: ["responses", "opportunities"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { defined: { type: "boolean" }, share: { type: "number" } },
      required: ["defined", "share"],
    },
    ports: {
      inputs: [
        {
          id: "responses",
          label: "Responses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "opportunities",
          label: "Opportunities",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = responseOpportunityZeroDenominatorTool.execute;
export default responseOpportunityZeroDenominatorTool;
