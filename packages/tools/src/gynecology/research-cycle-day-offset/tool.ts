import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDay: number;
  readonly suppliedCycleOrigin: number;
  readonly oneBased: boolean;
};
export type Output = { readonly relativeDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDay: { type: "integer" },
    suppliedCycleOrigin: { type: "integer" },
    oneBased: { type: "boolean" },
  },
  required: ["recordedDay", "suppliedCycleOrigin", "oneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeDay: { type: "integer" } },
  required: ["relativeDay"],
} as const;
/** Relabel supplied diary day indices under an explicit research origin, without cycle prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDay, suppliedCycleOrigin, oneBased } = request;
  const compute = (): Output => {
    return {
      relativeDay: recordedDay - suppliedCycleOrigin + (oneBased ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDay: 20, suppliedCycleOrigin: 10, oneBased: true },
  output: { relativeDay: 11 },
} satisfies ToolExample<Input, Output>;
export const researchCycleDayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/research-cycle-day-offset",
    title: "Research Cycle Day Offset Tool",
    description:
      "Relabel supplied diary day indices under an explicit research origin, without cycle prediction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDay: { type: "integer" },
        suppliedCycleOrigin: { type: "integer" },
        oneBased: { type: "boolean" },
      },
      required: ["recordedDay", "suppliedCycleOrigin", "oneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeDay: { type: "integer" } },
      required: ["relativeDay"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDay",
          label: "Recorded Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedCycleOrigin",
          label: "Supplied Cycle Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oneBased",
          label: "One Based",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "relativeDay",
          label: "Relative Day",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchCycleDayOffsetTool.execute;
export default researchCycleDayOffsetTool;
