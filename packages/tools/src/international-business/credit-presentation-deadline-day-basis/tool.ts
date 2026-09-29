import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedCalendarDays: number;
  readonly suppliedBusinessDays: number;
  readonly allowedDays: number;
  readonly useBusinessBasis: boolean;
};
export type Output = { readonly countedDays: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedCalendarDays: { type: "integer", minimum: 0 },
    suppliedBusinessDays: { type: "integer", minimum: 0 },
    allowedDays: { type: "integer", minimum: 0 },
    useBusinessBasis: { type: "boolean" },
  },
  required: [
    "elapsedCalendarDays",
    "suppliedBusinessDays",
    "allowedDays",
    "useBusinessBasis",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { countedDays: { type: "integer" }, margin: { type: "integer" } },
  required: ["countedDays", "margin"],
} as const;
/** Apply an explicit calendar/business-day count already resolved by the caller; no banking rules or holidays are selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    elapsedCalendarDays,
    suppliedBusinessDays,
    allowedDays,
    useBusinessBasis,
  } = request;
  const compute = (): Output => {
    H.integer(elapsedCalendarDays, 0);
    H.integer(suppliedBusinessDays, 0, elapsedCalendarDays);
    H.integer(allowedDays, 0);
    return {
      countedDays: useBusinessBasis
        ? suppliedBusinessDays
        : elapsedCalendarDays,
      margin:
        allowedDays -
        (useBusinessBasis ? suppliedBusinessDays : elapsedCalendarDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsedCalendarDays: 10,
    suppliedBusinessDays: 7,
    allowedDays: 8,
    useBusinessBasis: true,
  },
  output: { countedDays: 7, margin: 1 },
} satisfies ToolExample<Input, Output>;
export const creditPresentationDeadlineDayBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/credit-presentation-deadline-day-basis",
    title: "Credit Presentation Deadline Day Basis Tool",
    description:
      "Apply an explicit calendar/business-day count already resolved by the caller; no banking rules or holidays are selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedCalendarDays: { type: "integer", minimum: 0 },
        suppliedBusinessDays: { type: "integer", minimum: 0 },
        allowedDays: { type: "integer", minimum: 0 },
        useBusinessBasis: { type: "boolean" },
      },
      required: [
        "elapsedCalendarDays",
        "suppliedBusinessDays",
        "allowedDays",
        "useBusinessBasis",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedDays: { type: "integer" },
        margin: { type: "integer" },
      },
      required: ["countedDays", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedCalendarDays",
          label: "Elapsed Calendar Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedBusinessDays",
          label: "Supplied Business Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedDays",
          label: "Allowed Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useBusinessBasis",
          label: "Use Business Basis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedDays",
          label: "Counted Days",
          valueType: { type: "integer" },
        },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = creditPresentationDeadlineDayBasisTool.execute;
export default creditPresentationDeadlineDayBasisTool;
