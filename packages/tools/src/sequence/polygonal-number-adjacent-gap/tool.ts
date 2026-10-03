import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sides: number; readonly index: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sides: { type: "integer", minimum: 3, maximum: 1000000 },
    index: { type: "integer", minimum: 0, maximum: 1000000 },
  },
  required: ["sides", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Calculate polygonal number adjacent gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sides, index } = request;
  const compute = (): Output => {
    H.integer(sides, 3, 1000000);
    H.integer(index, 0, 1000000);
    return { gap: (sides - 2) * index + 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sides: 5, index: 3 },
  output: { gap: 10 },
} satisfies ToolExample<Input, Output>;
export const polygonalNumberAdjacentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/polygonal-number-adjacent-gap",
    title: "Polygonal Number Adjacent Gap Tool",
    description:
      "Calculate polygonal number adjacent gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sides: { type: "integer", minimum: 3, maximum: 1000000 },
        index: { type: "integer", minimum: 0, maximum: 1000000 },
      },
      required: ["sides", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "sides",
          label: "Sides",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = polygonalNumberAdjacentGapTool.execute;
export default polygonalNumberAdjacentGapTool;
