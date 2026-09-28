import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reachable: boolean; readonly distance: number };
export type Output = { readonly text: string; readonly finite: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reachable: { type: "boolean" },
    distance: { type: "number", minimum: 0 },
  },
  required: ["reachable", "distance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    finite: { type: "boolean" },
  },
  required: ["text", "finite"],
} as const;
/** Calculate disconnected distance infinity token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reachable, distance } = request;
  const compute = (): Output => {
    H.domain(distance >= 0);
    return { text: reachable ? String(distance) : "∞", finite: reachable };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reachable: false, distance: 0 },
  output: { text: "∞", finite: false },
} satisfies ToolExample<Input, Output>;
export const disconnectedDistanceInfinityTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/disconnected-distance-infinity-token",
    title: "Disconnected Distance Infinity Token Tool",
    description:
      "Calculate disconnected distance infinity token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reachable: { type: "boolean" },
        distance: { type: "number", minimum: 0 },
      },
      required: ["reachable", "distance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        finite: { type: "boolean" },
      },
      required: ["text", "finite"],
    },
    ports: {
      inputs: [
        {
          id: "reachable",
          label: "Reachable",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "text", label: "Text", valueType: { type: "string" } },
        { id: "finite", label: "Finite", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = disconnectedDistanceInfinityTokenTool.execute;
export default disconnectedDistanceInfinityTokenTool;
