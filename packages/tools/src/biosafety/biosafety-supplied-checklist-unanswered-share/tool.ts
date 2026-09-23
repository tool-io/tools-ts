import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly answered: number;
  readonly unanswered: number;
  readonly notApplicable: number;
  readonly countNotApplicable: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly unansweredFraction: number;
  readonly completeFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answered: { type: "integer", minimum: 0 },
    unanswered: { type: "integer", minimum: 0 },
    notApplicable: { type: "integer", minimum: 0 },
    countNotApplicable: { type: "boolean" },
  },
  required: ["answered", "unanswered", "notApplicable", "countNotApplicable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    unansweredFraction: { type: "number" },
    completeFraction: { type: "number" },
  },
  required: ["denominator", "unansweredFraction", "completeFraction"],
} as const;
/** Calculate biosafety supplied checklist unanswered share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { answered, unanswered, notApplicable, countNotApplicable } = request;
  const compute = (): Output => {
    H.integer(answered, 0);
    H.integer(unanswered, 0);
    H.integer(notApplicable, 0);
    H.domain(answered + unanswered > 0);
    return {
      denominator:
        answered + unanswered + (countNotApplicable ? notApplicable : 0),
      unansweredFraction:
        unanswered /
        (answered + unanswered + (countNotApplicable ? notApplicable : 0)),
      completeFraction:
        answered /
        (answered + unanswered + (countNotApplicable ? notApplicable : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    answered: 15,
    unanswered: 3,
    notApplicable: 2,
    countNotApplicable: false,
  },
  output: {
    denominator: 18,
    unansweredFraction: 0.16666666666666666,
    completeFraction: 0.8333333333333334,
  },
} satisfies ToolExample<Input, Output>;
export const biosafetySuppliedChecklistUnansweredShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-supplied-checklist-unanswered-share",
      title: "Biosafety Supplied Checklist Unanswered Share Tool",
      description:
        "Calculate biosafety supplied checklist unanswered share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          answered: { type: "integer", minimum: 0 },
          unanswered: { type: "integer", minimum: 0 },
          notApplicable: { type: "integer", minimum: 0 },
          countNotApplicable: { type: "boolean" },
        },
        required: [
          "answered",
          "unanswered",
          "notApplicable",
          "countNotApplicable",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          unansweredFraction: { type: "number" },
          completeFraction: { type: "number" },
        },
        required: ["denominator", "unansweredFraction", "completeFraction"],
      },
      ports: {
        inputs: [
          {
            id: "answered",
            label: "Answered",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unanswered",
            label: "Unanswered",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "notApplicable",
            label: "Not Applicable",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "countNotApplicable",
            label: "Count Not Applicable",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "unansweredFraction",
            label: "Unanswered Fraction",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "completeFraction",
            label: "Complete Fraction",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosafetySuppliedChecklistUnansweredShareTool.execute;
export default biosafetySuppliedChecklistUnansweredShareTool;
