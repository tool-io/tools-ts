import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leadingCoefficient: number };
export type Output = {
  readonly zeroLeading: boolean;
  readonly canSolveForLeadingTerm: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leadingCoefficient: { type: "number" } },
  required: ["leadingCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroLeading: { type: "boolean" },
    canSolveForLeadingTerm: { type: "boolean" },
  },
  required: ["zeroLeading", "canSolveForLeadingTerm"],
} as const;
/** Flag whether an explicit leading linear-recurrence coefficient permits division without claiming the recurrence is otherwise well posed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leadingCoefficient } = request;
  const compute = (): Output => {
    return {
      zeroLeading: leadingCoefficient === 0,
      canSolveForLeadingTerm: leadingCoefficient !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leadingCoefficient: 0 },
  output: { zeroLeading: true, canSolveForLeadingTerm: false },
} satisfies ToolExample<Input, Output>;
export const recurrenceCoefficientZeroLeadingFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["sequence", "mathematics"],
        keywords: ["sequence", "mathematics"],
      },
      id: "sequence/recurrence-coefficient-zero-leading-flag",
      title: "Recurrence Coefficient Zero Leading Flag",
      description:
        "Flag whether an explicit leading linear-recurrence coefficient permits division without claiming the recurrence is otherwise well posed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { leadingCoefficient: { type: "number" } },
        required: ["leadingCoefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          zeroLeading: { type: "boolean" },
          canSolveForLeadingTerm: { type: "boolean" },
        },
        required: ["zeroLeading", "canSolveForLeadingTerm"],
      },
      ports: {
        inputs: [
          {
            id: "leadingCoefficient",
            label: "Leading Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "zeroLeading",
            label: "Zero Leading",
            valueType: { type: "boolean" },
          },
          {
            id: "canSolveForLeadingTerm",
            label: "Can Solve For Leading Term",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = recurrenceCoefficientZeroLeadingFlagTool.execute;
export default recurrenceCoefficientZeroLeadingFlagTool;
