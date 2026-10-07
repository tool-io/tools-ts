import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedMinutes: number;
  readonly elapsedMinutes: number;
};
export type Output = { readonly remainingMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedMinutes: { type: "number", minimum: 0 },
    elapsedMinutes: { type: "number", minimum: 0 },
  },
  required: ["plannedMinutes", "elapsedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingMinutes: { type: "number" } },
  required: ["remainingMinutes"],
} as const;
/** Subtract supplied elapsed supervised-play minutes from planned duration, retaining overruns without care recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedMinutes, elapsedMinutes } = request;
  const compute = (): Output => {
    H.domain(plannedMinutes >= 0, "plannedMinutes");
    H.domain(elapsedMinutes >= 0, "elapsedMinutes");
    return { remainingMinutes: plannedMinutes - elapsedMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedMinutes: 30, elapsedMinutes: 12 },
  output: { remainingMinutes: 18 },
} satisfies ToolExample<Input, Output>;
export const supervisedPlaySessionDurationRemainingTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["child-development", "child development", "psychology"],
        keywords: ["child development", "psychology"],
      },
      id: "child-development/supervised-play-session-duration-remaining",
      title: "Supervised Play Session Duration Remaining",
      description:
        "Subtract supplied elapsed supervised-play minutes from planned duration, retaining overruns without care recommendations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plannedMinutes: { type: "number", minimum: 0 },
          elapsedMinutes: { type: "number", minimum: 0 },
        },
        required: ["plannedMinutes", "elapsedMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { remainingMinutes: { type: "number" } },
        required: ["remainingMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "plannedMinutes",
            label: "Planned Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedMinutes",
            label: "Elapsed Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingMinutes",
            label: "Remaining Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = supervisedPlaySessionDurationRemainingTool.execute;
export default supervisedPlaySessionDurationRemainingTool;
