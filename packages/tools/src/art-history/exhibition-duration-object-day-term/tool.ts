import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objects: number;
  readonly displayDays: number;
  readonly loanDays: number;
};
export type Output = {
  readonly objectDisplayDays: number;
  readonly objectLoanDays: number;
  readonly displayFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objects: { type: "integer", minimum: 0 },
    displayDays: { type: "number", minimum: 0 },
    loanDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["objects", "displayDays", "loanDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectDisplayDays: { type: "number" },
    objectLoanDays: { type: "number" },
    displayFraction: { type: "number" },
  },
  required: ["objectDisplayDays", "objectLoanDays", "displayFraction"],
} as const;
/** Calculate exhibition duration object day term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objects, displayDays, loanDays } = request;
  const compute = (): Output => {
    H.integer(objects, 0);
    H.positive(loanDays);
    H.domain(displayDays >= 0 && displayDays <= loanDays);
    return {
      objectDisplayDays: objects * displayDays,
      objectLoanDays: objects * loanDays,
      displayFraction: displayDays / loanDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objects: 12, displayDays: 30, loanDays: 40 },
  output: {
    objectDisplayDays: 360,
    objectLoanDays: 480,
    displayFraction: 0.75,
  },
} satisfies ToolExample<Input, Output>;
export const exhibitionDurationObjectDayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/exhibition-duration-object-day-term",
    title: "Exhibition Duration Object Day Term Tool",
    description:
      "Calculate exhibition duration object day term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objects: { type: "integer", minimum: 0 },
        displayDays: { type: "number", minimum: 0 },
        loanDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["objects", "displayDays", "loanDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectDisplayDays: { type: "number" },
        objectLoanDays: { type: "number" },
        displayFraction: { type: "number" },
      },
      required: ["objectDisplayDays", "objectLoanDays", "displayFraction"],
    },
    ports: {
      inputs: [
        {
          id: "objects",
          label: "Objects",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "displayDays",
          label: "Display Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loanDays",
          label: "Loan Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "objectDisplayDays",
          label: "Object Display Days",
          valueType: { type: "number" },
        },
        {
          id: "objectLoanDays",
          label: "Object Loan Days",
          valueType: { type: "number" },
        },
        {
          id: "displayFraction",
          label: "Display Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exhibitionDurationObjectDayTermTool.execute;
export default exhibitionDurationObjectDayTermTool;
