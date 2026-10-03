import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referred: number;
  readonly responded: number;
  readonly excludedWait: number;
};
export type Output = { readonly elapsed: number; readonly countedWait: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referred: { type: "number" },
    responded: { type: "number" },
    excludedWait: { type: "number", minimum: 0 },
  },
  required: ["referred", "responded", "excludedWait"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, countedWait: { type: "number" } },
  required: ["elapsed", "countedWait"],
} as const;
/** Administrative supplied referral timing only, without evaluating urgency or service quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referred, responded, excludedWait } = request;
  const compute = (): Output => {
    H.domain(
      responded >= referred &&
        excludedWait >= 0 &&
        excludedWait <= responded - referred,
    );
    return {
      elapsed: responded - referred,
      countedWait: responded - referred - excludedWait,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referred: 10, responded: 30, excludedWait: 5 },
  output: { elapsed: 20, countedWait: 15 },
} satisfies ToolExample<Input, Output>;
export const referralResponseDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/referral-response-delay",
    title: "Referral Response Delay Tool",
    description:
      "Administrative supplied referral timing only, without evaluating urgency or service quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referred: { type: "number" },
        responded: { type: "number" },
        excludedWait: { type: "number", minimum: 0 },
      },
      required: ["referred", "responded", "excludedWait"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        countedWait: { type: "number" },
      },
      required: ["elapsed", "countedWait"],
    },
    ports: {
      inputs: [
        {
          id: "referred",
          label: "Referred",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responded",
          label: "Responded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedWait",
          label: "Excluded Wait",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "countedWait",
          label: "Counted Wait",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = referralResponseDelayTool.execute;
export default referralResponseDelayTool;
