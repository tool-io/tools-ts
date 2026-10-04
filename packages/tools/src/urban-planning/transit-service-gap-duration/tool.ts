import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousDeparture: number;
  readonly nextDeparture: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousDeparture: { type: "number" },
    nextDeparture: { type: "number" },
  },
  required: ["previousDeparture", "nextDeparture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Calculate transit service gap duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousDeparture, nextDeparture } = request;
  const compute = (): Output => {
    H.domain(nextDeparture >= previousDeparture);
    return { gap: nextDeparture - previousDeparture };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousDeparture: 10, nextDeparture: 25 },
  output: { gap: 15 },
} satisfies ToolExample<Input, Output>;
export const transitServiceGapDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/transit-service-gap-duration",
    title: "Transit Service Gap Duration Tool",
    description:
      "Calculate transit service gap duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousDeparture: { type: "number" },
        nextDeparture: { type: "number" },
      },
      required: ["previousDeparture", "nextDeparture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "previousDeparture",
          label: "Previous Departure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextDeparture",
          label: "Next Departure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = transitServiceGapDurationTool.execute;
export default transitServiceGapDurationTool;
