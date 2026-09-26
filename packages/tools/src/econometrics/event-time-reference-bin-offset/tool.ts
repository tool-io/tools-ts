import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly referenceBin: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "integer" },
    referenceBin: { type: "integer" },
  },
  required: ["eventTime", "referenceBin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "integer" } },
  required: ["offset"],
} as const;
/** Compare explicit event-time bin indices without choosing an identification reference period. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, referenceBin } = request;
  const compute = (): Output => {
    return { offset: eventTime - referenceBin };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: -2, referenceBin: -1 },
  output: { offset: -1 },
} satisfies ToolExample<Input, Output>;
export const eventTimeReferenceBinOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/event-time-reference-bin-offset",
    title: "Event Time Reference Bin Offset Tool",
    description:
      "Compare explicit event-time bin indices without choosing an identification reference period.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "integer" },
        referenceBin: { type: "integer" },
      },
      required: ["eventTime", "referenceBin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "integer" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceBin",
          label: "Reference Bin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = eventTimeReferenceBinOffsetTool.execute;
export default eventTimeReferenceBinOffsetTool;
