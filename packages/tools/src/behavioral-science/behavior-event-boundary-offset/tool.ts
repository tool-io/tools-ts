import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly eventAt: number; readonly boundaryAt: number };
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eventAt: { type: "number" }, boundaryAt: { type: "number" } },
  required: ["eventAt", "boundaryAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Calculate behavior event boundary offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, boundaryAt } = request;
  const compute = (): Output => {
    return { offset: eventAt - boundaryAt };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventAt: 15, boundaryAt: 10 },
  output: { offset: 5 },
} satisfies ToolExample<Input, Output>;
export const behaviorEventBoundaryOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/behavior-event-boundary-offset",
    title: "Behavior Event Boundary Offset Tool",
    description:
      "Calculate behavior event boundary offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        boundaryAt: { type: "number" },
      },
      required: ["eventAt", "boundaryAt"],
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
          id: "boundaryAt",
          label: "Boundary At",
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
export const run = behaviorEventBoundaryOffsetTool.execute;
export default behaviorEventBoundaryOffsetTool;
