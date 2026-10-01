import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventAt: number;
  readonly referenceAt: number;
  readonly clockCorrection: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventAt: { type: "number" },
    referenceAt: { type: "number" },
    clockCorrection: { type: "number" },
  },
  required: ["eventAt", "referenceAt", "clockCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Compare supplied research event clocks without vestibular diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, referenceAt, clockCorrection } = request;
  const compute = (): Output => {
    return { offset: eventAt - referenceAt - clockCorrection };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventAt: 20, referenceAt: 10, clockCorrection: 3 },
  output: { offset: 7 },
} satisfies ToolExample<Input, Output>;
export const vestibularEventRelativeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/vestibular-event-relative-offset",
    title: "Vestibular Event Relative Offset Tool",
    description:
      "Compare supplied research event clocks without vestibular diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        referenceAt: { type: "number" },
        clockCorrection: { type: "number" },
      },
      required: ["eventAt", "referenceAt", "clockCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "eventAt",
          label: "Event At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAt",
          label: "Reference At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockCorrection",
          label: "Clock Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vestibularEventRelativeOffsetTool.execute;
export default vestibularEventRelativeOffsetTool;
