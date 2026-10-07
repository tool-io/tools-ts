import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pieAmount: number;
  readonly offeredToResponder: number;
};
export type Output = {
  readonly responderShare: number;
  readonly proposerRemainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pieAmount: { type: "number", exclusiveMinimum: 0 },
    offeredToResponder: { type: "number", minimum: 0 },
  },
  required: ["pieAmount", "offeredToResponder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responderShare: { type: "number" },
    proposerRemainder: { type: "number" },
  },
  required: ["responderShare", "proposerRemainder"],
} as const;
/** Describe an explicitly recorded ultimatum-game offer without predicting acceptance or evaluating fairness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pieAmount, offeredToResponder } = request;
  const compute = (): Output => {
    (H.domain(pieAmount > 0, "pieAmount"), pieAmount);
    H.domain(
      offeredToResponder >= 0 && offeredToResponder <= pieAmount,
      "offeredToResponder",
    );
    return {
      responderShare: offeredToResponder / pieAmount,
      proposerRemainder: pieAmount - offeredToResponder,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pieAmount: 20, offeredToResponder: 8 },
  output: { responderShare: 0.4, proposerRemainder: 12 },
} satisfies ToolExample<Input, Output>;
export const ultimatumOfferPieShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/ultimatum-offer-pie-share",
    title: "Ultimatum Offer Pie Share",
    description:
      "Describe an explicitly recorded ultimatum-game offer without predicting acceptance or evaluating fairness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pieAmount: { type: "number", exclusiveMinimum: 0 },
        offeredToResponder: { type: "number", minimum: 0 },
      },
      required: ["pieAmount", "offeredToResponder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responderShare: { type: "number" },
        proposerRemainder: { type: "number" },
      },
      required: ["responderShare", "proposerRemainder"],
    },
    ports: {
      inputs: [
        {
          id: "pieAmount",
          label: "Pie Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offeredToResponder",
          label: "Offered To Responder",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "responderShare",
          label: "Responder Share",
          valueType: { type: "number" },
        },
        {
          id: "proposerRemainder",
          label: "Proposer Remainder",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ultimatumOfferPieShareTool.execute;
export default ultimatumOfferPieShareTool;
