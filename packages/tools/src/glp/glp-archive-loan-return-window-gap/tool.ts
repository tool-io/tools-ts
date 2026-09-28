import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loanDay: number;
  readonly expectedReturn: number;
  readonly actualReturn: number;
  readonly returned: boolean;
  readonly today: number;
  readonly extension: number;
};
export type Output = {
  readonly effectiveDue: number;
  readonly elapsed: number;
  readonly overdue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loanDay: { type: "integer" },
    expectedReturn: { type: "integer" },
    actualReturn: { type: "integer" },
    returned: { type: "boolean" },
    today: { type: "integer" },
    extension: { type: "integer", minimum: 0 },
  },
  required: [
    "loanDay",
    "expectedReturn",
    "actualReturn",
    "returned",
    "today",
    "extension",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDue: { type: "integer" },
    elapsed: { type: "integer" },
    overdue: { type: "integer" },
  },
  required: ["effectiveDue", "elapsed", "overdue"],
} as const;
/** Calculate glp archive loan return window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loanDay, expectedReturn, actualReturn, returned, today, extension } =
    request;
  const compute = (): Output => {
    H.integer(extension, 0);
    H.domain(
      expectedReturn >= loanDay && (returned ? actualReturn : today) >= loanDay,
    );
    return {
      effectiveDue: expectedReturn + extension,
      elapsed: (returned ? actualReturn : today) - loanDay,
      overdue: Math.max(
        0,
        (returned ? actualReturn : today) - expectedReturn - extension,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    loanDay: 100,
    expectedReturn: 110,
    actualReturn: 115,
    returned: true,
    today: 120,
    extension: 2,
  },
  output: { effectiveDue: 112, elapsed: 15, overdue: 3 },
} satisfies ToolExample<Input, Output>;
export const glpArchiveLoanReturnWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-archive-loan-return-window-gap",
    title: "GLP Archive Loan Return Window Gap Tool",
    description:
      "Calculate glp archive loan return window gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loanDay: { type: "integer" },
        expectedReturn: { type: "integer" },
        actualReturn: { type: "integer" },
        returned: { type: "boolean" },
        today: { type: "integer" },
        extension: { type: "integer", minimum: 0 },
      },
      required: [
        "loanDay",
        "expectedReturn",
        "actualReturn",
        "returned",
        "today",
        "extension",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveDue: { type: "integer" },
        elapsed: { type: "integer" },
        overdue: { type: "integer" },
      },
      required: ["effectiveDue", "elapsed", "overdue"],
    },
    ports: {
      inputs: [
        {
          id: "loanDay",
          label: "Loan Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expectedReturn",
          label: "Expected Return",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "actualReturn",
          label: "Actual Return",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "today",
          label: "Today",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "extension",
          label: "Extension",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "effectiveDue",
          label: "Effective Due",
          valueType: { type: "integer" },
        },
        { id: "elapsed", label: "Elapsed", valueType: { type: "integer" } },
        { id: "overdue", label: "Overdue", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = glpArchiveLoanReturnWindowGapTool.execute;
export default glpArchiveLoanReturnWindowGapTool;
