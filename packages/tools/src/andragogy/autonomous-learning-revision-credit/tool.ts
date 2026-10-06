import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCredits: number;
  readonly revisionCredits: number;
  readonly withdrawnCredits: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCredits: { type: "number", minimum: 0 },
    revisionCredits: { type: "number", minimum: 0 },
    withdrawnCredits: { type: "number", minimum: 0 },
  },
  required: ["openingCredits", "revisionCredits", "withdrawnCredits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "number" } },
  required: ["closingBalance"],
} as const;
/** Update an explicit autonomous-learning revision credit value without assessing learning outcomes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCredits, revisionCredits, withdrawnCredits } = request;
  const compute = (): Output => {
    H.domain(openingCredits >= 0, "openingCredits");
    H.domain(revisionCredits >= 0, "revisionCredits");
    H.domain(withdrawnCredits >= 0, "withdrawnCredits");
    return {
      closingBalance: openingCredits + revisionCredits - withdrawnCredits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCredits: 20, revisionCredits: 8, withdrawnCredits: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const autonomousLearningRevisionCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/autonomous-learning-revision-credit",
    title: "Autonomous Learning Revision Credit",
    description:
      "Update an explicit autonomous-learning revision credit value without assessing learning outcomes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCredits: { type: "number", minimum: 0 },
        revisionCredits: { type: "number", minimum: 0 },
        withdrawnCredits: { type: "number", minimum: 0 },
      },
      required: ["openingCredits", "revisionCredits", "withdrawnCredits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingBalance: { type: "number" } },
      required: ["closingBalance"],
    },
    ports: {
      inputs: [
        {
          id: "openingCredits",
          label: "Opening Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "revisionCredits",
          label: "Revision Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrawnCredits",
          label: "Withdrawn Credits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingBalance",
          label: "Closing Balance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = autonomousLearningRevisionCreditTool.execute;
export default autonomousLearningRevisionCreditTool;
