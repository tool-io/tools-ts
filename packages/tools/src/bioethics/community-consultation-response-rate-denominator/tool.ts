import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responses: number;
  readonly invited: number;
  readonly excluded: number;
};
export type Output = { readonly eligible: number; readonly rate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responses: { type: "integer", minimum: 0 },
    invited: { type: "integer", minimum: 1 },
    excluded: { type: "integer", minimum: 0 },
  },
  required: ["responses", "invited", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligible: { type: "integer" }, rate: { type: "number" } },
  required: ["eligible", "rate"],
} as const;
/** Calculate community consultation response rate denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responses, invited, excluded } = request;
  const compute = (): Output => {
    H.integer(invited, 1);
    H.integer(excluded, 0, invited - 1);
    H.integer(responses, 0, invited - excluded);
    return {
      eligible: invited - excluded,
      rate: responses / (invited - excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responses: 30, invited: 50, excluded: 10 },
  output: { eligible: 40, rate: 0.75 },
} satisfies ToolExample<Input, Output>;
export const communityConsultationResponseRateDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/community-consultation-response-rate-denominator",
      title: "Community Consultation Response Rate Denominator Tool",
      description:
        "Calculate community consultation response rate denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responses: { type: "integer", minimum: 0 },
          invited: { type: "integer", minimum: 1 },
          excluded: { type: "integer", minimum: 0 },
        },
        required: ["responses", "invited", "excluded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { eligible: { type: "integer" }, rate: { type: "number" } },
        required: ["eligible", "rate"],
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
            id: "invited",
            label: "Invited",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
          { id: "rate", label: "Rate", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = communityConsultationResponseRateDenominatorTool.execute;
export default communityConsultationResponseRateDenominatorTool;
