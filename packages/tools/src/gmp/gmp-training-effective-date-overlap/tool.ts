import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trainingStart: number;
  readonly trainingEnd: number;
  readonly effectiveDay: number;
  readonly requiredRole: string;
  readonly trainedRoles: readonly string[];
};
export type Output = {
  readonly trainedAtEffective: boolean;
  readonly roleCovered: boolean;
  readonly gapDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trainingStart: { type: "integer" },
    trainingEnd: { type: "integer" },
    effectiveDay: { type: "integer" },
    requiredRole: { type: "string", maxLength: 8192 },
    trainedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "trainingStart",
    "trainingEnd",
    "effectiveDay",
    "requiredRole",
    "trainedRoles",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trainedAtEffective: { type: "boolean" },
    roleCovered: { type: "boolean" },
    gapDays: { type: "integer" },
  },
  required: ["trainedAtEffective", "roleCovered", "gapDays"],
} as const;
/** Compare supplied training validity, role and effective-date metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    trainingStart,
    trainingEnd,
    effectiveDay,
    requiredRole,
    trainedRoles,
  } = request;
  const compute = (): Output => {
    H.domain(trainingEnd >= trainingStart);
    return {
      trainedAtEffective:
        effectiveDay >= trainingStart && effectiveDay <= trainingEnd,
      roleCovered: trainedRoles.includes(requiredRole),
      gapDays:
        effectiveDay < trainingStart
          ? trainingStart - effectiveDay
          : effectiveDay > trainingEnd
            ? effectiveDay - trainingEnd
            : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trainingStart: 100,
    trainingEnd: 150,
    effectiveDay: 120,
    requiredRole: "operator",
    trainedRoles: ["operator"],
  },
  output: { trainedAtEffective: true, roleCovered: true, gapDays: 0 },
} satisfies ToolExample<Input, Output>;
export const gmpTrainingEffectiveDateOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-training-effective-date-overlap",
    title: "GMP Training Effective Date Overlap Tool",
    description:
      "Compare supplied training validity, role and effective-date metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trainingStart: { type: "integer" },
        trainingEnd: { type: "integer" },
        effectiveDay: { type: "integer" },
        requiredRole: { type: "string", maxLength: 8192 },
        trainedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "trainingStart",
        "trainingEnd",
        "effectiveDay",
        "requiredRole",
        "trainedRoles",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trainedAtEffective: { type: "boolean" },
        roleCovered: { type: "boolean" },
        gapDays: { type: "integer" },
      },
      required: ["trainedAtEffective", "roleCovered", "gapDays"],
    },
    ports: {
      inputs: [
        {
          id: "trainingStart",
          label: "Training Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "trainingEnd",
          label: "Training End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effectiveDay",
          label: "Effective Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredRole",
          label: "Required Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trainedRoles",
          label: "Trained Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "trainedAtEffective",
          label: "Trained At Effective",
          valueType: { type: "boolean" },
        },
        {
          id: "roleCovered",
          label: "Role Covered",
          valueType: { type: "boolean" },
        },
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = gmpTrainingEffectiveDateOverlapTool.execute;
export default gmpTrainingEffectiveDateOverlapTool;
