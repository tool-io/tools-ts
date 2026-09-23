import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeBefore: number;
  readonly revived: number;
  readonly retained: number;
  readonly includeRevived: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly retainedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeBefore: { type: "integer", minimum: 1 },
    revived: { type: "integer", minimum: 0 },
    retained: { type: "integer", minimum: 0 },
    includeRevived: { type: "boolean" },
  },
  required: ["activeBefore", "revived", "retained", "includeRevived"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    retainedShare: { type: "number" },
  },
  required: ["denominator", "retainedShare"],
} as const;
/** Calculate cohort revival period base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeBefore, revived, retained, includeRevived } = request;
  const compute = (): Output => {
    H.integer(activeBefore, 1);
    H.integer(revived, 0);
    H.integer(retained, 0, activeBefore);
    return {
      denominator: activeBefore + (includeRevived ? revived : 0),
      retainedShare: retained / (activeBefore + (includeRevived ? revived : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activeBefore: 100,
    revived: 20,
    retained: 80,
    includeRevived: false,
  },
  output: { denominator: 100, retainedShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const cohortRevivalPeriodBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/cohort-revival-period-base-flag",
    title: "Cohort Revival Period Base Flag Tool",
    description:
      "Calculate cohort revival period base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeBefore: { type: "integer", minimum: 1 },
        revived: { type: "integer", minimum: 0 },
        retained: { type: "integer", minimum: 0 },
        includeRevived: { type: "boolean" },
      },
      required: ["activeBefore", "revived", "retained", "includeRevived"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        retainedShare: { type: "number" },
      },
      required: ["denominator", "retainedShare"],
    },
    ports: {
      inputs: [
        {
          id: "activeBefore",
          label: "Active Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "revived",
          label: "Revived",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retained",
          label: "Retained",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeRevived",
          label: "Include Revived",
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
          id: "retainedShare",
          label: "Retained Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = cohortRevivalPeriodBaseFlagTool.execute;
export default cohortRevivalPeriodBaseFlagTool;
