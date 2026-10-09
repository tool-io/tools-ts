import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stakeholderId: string;
  readonly suppliedBenefitWording: string;
  readonly suppliedBurdenWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stakeholderId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBenefitWording: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBurdenWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "stakeholderId",
    "suppliedBenefitWording",
    "suppliedBurdenWording",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit stakeholder benefit and burden wording without making an ethical judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stakeholderId, suppliedBenefitWording, suppliedBurdenWording } =
    request;
  const compute = (): Output => {
    H.domain(stakeholderId.length > 0, "stakeholderId");
    H.domain(suppliedBenefitWording.length > 0, "suppliedBenefitWording");
    H.domain(suppliedBurdenWording.length > 0, "suppliedBurdenWording");
    return {
      token: JSON.stringify([
        stakeholderId,
        suppliedBenefitWording,
        suppliedBurdenWording,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stakeholderId: "S17",
    suppliedBenefitWording: "Benefit A",
    suppliedBurdenWording: "Burden B",
  },
  output: { token: '["S17","Benefit A","Burden B"]' },
} satisfies ToolExample<Input, Output>;
export const stakeholderBenefitBurdenPairLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethics", "philosophy"],
      keywords: ["ethics", "philosophy"],
    },
    id: "ethics/stakeholder-benefit-burden-pair-label",
    title: "Stakeholder Benefit Burden Pair Label",
    description:
      "Pair explicit stakeholder benefit and burden wording without making an ethical judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stakeholderId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedBenefitWording: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        suppliedBurdenWording: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: [
        "stakeholderId",
        "suppliedBenefitWording",
        "suppliedBurdenWording",
      ],
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
          id: "stakeholderId",
          label: "Stakeholder Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBenefitWording",
          label: "Supplied Benefit Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBurdenWording",
          label: "Supplied Burden Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = stakeholderBenefitBurdenPairLabelTool.execute;
export default stakeholderBenefitBurdenPairLabelTool;
