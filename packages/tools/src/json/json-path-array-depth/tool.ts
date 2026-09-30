import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly segmentKinds: readonly string[] };
export type Output = { readonly arrayDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentKinds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["segmentKinds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { arrayDepth: { type: "integer" } },
  required: ["arrayDepth"],
} as const;
/** Count array traversals in explicit path segment kinds, without guessing whether numeric keys identify arrays. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentKinds } = request;
  const compute = (): Output => {
    H.domain(segmentKinds.every((x) => ["object", "array"].includes(x)));
    return { arrayDepth: segmentKinds.filter((x) => x === "array").length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentKinds: ["object", "array", "array"] },
  output: { arrayDepth: 2 },
} satisfies ToolExample<Input, Output>;
export const jsonPathArrayDepthTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "json/json-path-array-depth",
    title: "JSON Path Array Depth Tool",
    description:
      "Count array traversals in explicit path segment kinds, without guessing whether numeric keys identify arrays.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentKinds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["segmentKinds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { arrayDepth: { type: "integer" } },
      required: ["arrayDepth"],
    },
    ports: {
      inputs: [
        {
          id: "segmentKinds",
          label: "Segment Kinds",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "arrayDepth",
          label: "Array Depth",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonPathArrayDepthTool.execute;
export default jsonPathArrayDepthTool;
