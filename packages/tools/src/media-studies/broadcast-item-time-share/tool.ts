import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemSeconds: number;
  readonly programSeconds: number;
};
export type Output = { readonly timeShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemSeconds: { type: "number", minimum: 0 },
    programSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["itemSeconds", "programSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { timeShare: { type: "number" } },
  required: ["timeShare"],
} as const;
/** Compute one broadcast item's share of a supplied program duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemSeconds, programSeconds } = request;
  const compute = (): Output => {
    (H.domain(programSeconds > 0, "programSeconds"), programSeconds);
    H.domain(itemSeconds >= 0 && itemSeconds <= programSeconds, "itemSeconds");
    return { timeShare: itemSeconds / programSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemSeconds: 90, programSeconds: 1800 },
  output: { timeShare: 0.05 },
} satisfies ToolExample<Input, Output>;
export const broadcastItemTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/broadcast-item-time-share",
    title: "Broadcast Item Time Share Tool",
    description:
      "Compute one broadcast item's share of a supplied program duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemSeconds: { type: "number", minimum: 0 },
        programSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["itemSeconds", "programSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { timeShare: { type: "number" } },
      required: ["timeShare"],
    },
    ports: {
      inputs: [
        {
          id: "itemSeconds",
          label: "Item Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "programSeconds",
          label: "Program Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "timeShare", label: "Time Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = broadcastItemTimeShareTool.execute;
export default broadcastItemTimeShareTool;
