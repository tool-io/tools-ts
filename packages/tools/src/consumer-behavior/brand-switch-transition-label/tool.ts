import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousBrandCode: string;
  readonly currentBrandCode: string;
};
export type Output = {
  readonly switched: boolean;
  readonly transition: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousBrandCode: { type: "string", maxLength: 8192, minLength: 1 },
    currentBrandCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["previousBrandCode", "currentBrandCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    switched: { type: "boolean" },
    transition: { type: "string", maxLength: 8192 },
  },
  required: ["switched", "transition"],
} as const;
/** Describe an explicit previous-to-current brand-code transition without predicting loyalty or future purchases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousBrandCode, currentBrandCode } = request;
  const compute = (): Output => {
    H.domain(
      previousBrandCode.length > 0 && currentBrandCode.length > 0,
      "previousBrandCode",
    );
    return {
      switched: previousBrandCode !== currentBrandCode,
      transition: JSON.stringify([previousBrandCode, currentBrandCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousBrandCode: "A", currentBrandCode: "B" },
  output: { switched: true, transition: '["A","B"]' },
} satisfies ToolExample<Input, Output>;
export const brandSwitchTransitionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/brand-switch-transition-label",
    title: "Brand Switch Transition Label",
    description:
      "Describe an explicit previous-to-current brand-code transition without predicting loyalty or future purchases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousBrandCode: { type: "string", maxLength: 8192, minLength: 1 },
        currentBrandCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["previousBrandCode", "currentBrandCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        switched: { type: "boolean" },
        transition: { type: "string", maxLength: 8192 },
      },
      required: ["switched", "transition"],
    },
    ports: {
      inputs: [
        {
          id: "previousBrandCode",
          label: "Previous Brand Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentBrandCode",
          label: "Current Brand Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "switched", label: "Switched", valueType: { type: "boolean" } },
        {
          id: "transition",
          label: "Transition",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = brandSwitchTransitionLabelTool.execute;
export default brandSwitchTransitionLabelTool;
