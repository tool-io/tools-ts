import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visibleMinutes: number;
  readonly scheduledMinutes: number;
};
export type Output = {
  readonly visibleFraction: number;
  readonly notVisibleMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleMinutes: { type: "number", minimum: 0 },
    scheduledMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["visibleMinutes", "scheduledMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleFraction: { type: "number" },
    notVisibleMinutes: { type: "number" },
  },
  required: ["visibleFraction", "notVisibleMinutes"],
} as const;
/** Describe visible coverage of an explicitly scheduled play observation without imputing unobserved behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visibleMinutes, scheduledMinutes } = request;
  const compute = (): Output => {
    (H.domain(scheduledMinutes > 0, "scheduledMinutes"), scheduledMinutes);
    H.domain(
      visibleMinutes >= 0 && visibleMinutes <= scheduledMinutes,
      "visibleMinutes",
    );
    return {
      visibleFraction: visibleMinutes / scheduledMinutes,
      notVisibleMinutes: scheduledMinutes - visibleMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visibleMinutes: 18, scheduledMinutes: 24 },
  output: { visibleFraction: 0.75, notVisibleMinutes: 6 },
} satisfies ToolExample<Input, Output>;
export const playObservationVisibleMinuteFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["child-development", "child development", "psychology"],
        keywords: ["child development", "psychology"],
      },
      id: "child-development/play-observation-visible-minute-fraction",
      title: "Play Observation Visible Minute Fraction",
      description:
        "Describe visible coverage of an explicitly scheduled play observation without imputing unobserved behavior.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          visibleMinutes: { type: "number", minimum: 0 },
          scheduledMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["visibleMinutes", "scheduledMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          visibleFraction: { type: "number" },
          notVisibleMinutes: { type: "number" },
        },
        required: ["visibleFraction", "notVisibleMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "visibleMinutes",
            label: "Visible Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scheduledMinutes",
            label: "Scheduled Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "visibleFraction",
            label: "Visible Fraction",
            valueType: { type: "number" },
          },
          {
            id: "notVisibleMinutes",
            label: "Not Visible Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = playObservationVisibleMinuteFractionTool.execute;
export default playObservationVisibleMinuteFractionTool;
