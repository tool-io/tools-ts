import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effectiveDay: number;
  readonly trainingDay: number;
  readonly requiredLeadDays: number;
};
export type Output = {
  readonly leadDays: number;
  readonly marginDays: number;
  readonly completedBeforeEffective: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDay: { type: "integer" },
    trainingDay: { type: "integer" },
    requiredLeadDays: { type: "integer", minimum: 0 },
  },
  required: ["effectiveDay", "trainingDay", "requiredLeadDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadDays: { type: "integer" },
    marginDays: { type: "integer" },
    completedBeforeEffective: { type: "boolean" },
  },
  required: ["leadDays", "marginDays", "completedBeforeEffective"],
} as const;
/** Calculate quality change effective training gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effectiveDay, trainingDay, requiredLeadDays } = request;
  const compute = (): Output => {
    H.integer(requiredLeadDays, 0);
    return {
      leadDays: effectiveDay - trainingDay,
      marginDays: effectiveDay - trainingDay - requiredLeadDays,
      completedBeforeEffective: trainingDay <= effectiveDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effectiveDay: 120, trainingDay: 110, requiredLeadDays: 7 },
  output: { leadDays: 10, marginDays: 3, completedBeforeEffective: true },
} satisfies ToolExample<Input, Output>;
export const qualityChangeEffectiveTrainingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/quality-change-effective-training-gap",
    title: "Quality Change Effective Training Gap Tool",
    description:
      "Calculate quality change effective training gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveDay: { type: "integer" },
        trainingDay: { type: "integer" },
        requiredLeadDays: { type: "integer", minimum: 0 },
      },
      required: ["effectiveDay", "trainingDay", "requiredLeadDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadDays: { type: "integer" },
        marginDays: { type: "integer" },
        completedBeforeEffective: { type: "boolean" },
      },
      required: ["leadDays", "marginDays", "completedBeforeEffective"],
    },
    ports: {
      inputs: [
        {
          id: "effectiveDay",
          label: "Effective Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "trainingDay",
          label: "Training Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredLeadDays",
          label: "Required Lead Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "leadDays", label: "Lead Days", valueType: { type: "integer" } },
        {
          id: "marginDays",
          label: "Margin Days",
          valueType: { type: "integer" },
        },
        {
          id: "completedBeforeEffective",
          label: "Completed Before Effective",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qualityChangeEffectiveTrainingGapTool.execute;
export default qualityChangeEffectiveTrainingGapTool;
