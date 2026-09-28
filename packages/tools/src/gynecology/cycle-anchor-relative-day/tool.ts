import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDay: number;
  readonly anchorDay: number;
  readonly origin: number;
};
export type Output = { readonly relativeDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDay: { type: "integer" },
    anchorDay: { type: "integer" },
    origin: { type: "integer" },
  },
  required: ["observedDay", "anchorDay", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeDay: { type: "integer" } },
  required: ["relativeDay"],
} as const;
/** Map supplied research diary days relative to an explicit cycle anchor without fertility prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDay, anchorDay, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    return {
      relativeDay: Number(
        BigInt(observedDay) - BigInt(anchorDay) + BigInt(origin),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedDay: 15, anchorDay: 10, origin: 1 },
  output: { relativeDay: 6 },
} satisfies ToolExample<Input, Output>;
export const cycleAnchorRelativeDayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/cycle-anchor-relative-day",
    title: "Cycle Anchor Relative Day Tool",
    description:
      "Map supplied research diary days relative to an explicit cycle anchor without fertility prediction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDay: { type: "integer" },
        anchorDay: { type: "integer" },
        origin: { type: "integer" },
      },
      required: ["observedDay", "anchorDay", "origin"],
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
          id: "observedDay",
          label: "Observed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "anchorDay",
          label: "Anchor Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
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
export const run = cycleAnchorRelativeDayTool.execute;
export default cycleAnchorRelativeDayTool;
