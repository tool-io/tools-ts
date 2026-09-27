import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consented: readonly boolean[];
  readonly withdrawn: readonly boolean[];
  readonly allowed: readonly boolean[];
};
export type Output = {
  readonly eligible: readonly boolean[];
  readonly indices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consented: { type: "array", maxItems: 256, items: { type: "boolean" } },
    withdrawn: { type: "array", maxItems: 256, items: { type: "boolean" } },
    allowed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["consented", "withdrawn", "allowed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    indices: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["eligible", "indices"],
} as const;
/** Build a supplied-flag eligibility mask; no lottery draw, consent authority or entitlement decision is made. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { consented, withdrawn, allowed } = request;
  const compute = (): Output => {
    H.sameLength(consented, withdrawn);
    H.sameLength(consented, allowed);
    const eligible = consented.map((x, i) => x && !withdrawn[i] && allowed[i]);
    return { eligible, indices: eligible.flatMap((x, i) => (x ? [i] : [])) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    consented: [true, true, false],
    withdrawn: [false, true, false],
    allowed: [true, true, true],
  },
  output: { eligible: [true, false, false], indices: [0] },
} satisfies ToolExample<Input, Output>;
export const consentLotteryEligibilityMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/consent-lottery-eligibility-mask",
    title: "Consent Lottery Eligibility Mask Tool",
    description:
      "Build a supplied-flag eligibility mask; no lottery draw, consent authority or entitlement decision is made.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consented: { type: "array", maxItems: 256, items: { type: "boolean" } },
        withdrawn: { type: "array", maxItems: 256, items: { type: "boolean" } },
        allowed: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["consented", "withdrawn", "allowed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
        indices: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["eligible", "indices"],
    },
    ports: {
      inputs: [
        {
          id: "consented",
          label: "Consented",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "withdrawn",
          label: "Withdrawn",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "allowed",
          label: "Allowed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "eligible",
          label: "Eligible",
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "indices",
          label: "Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = consentLotteryEligibilityMaskTool.execute;
export default consentLotteryEligibilityMaskTool;
