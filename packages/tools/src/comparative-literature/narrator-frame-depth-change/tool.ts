import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDepth: number;
  readonly opens: number;
  readonly closes: number;
};
export type Output = { readonly nextDepth: number; readonly change: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDepth: { type: "integer", minimum: 0 },
    opens: { type: "integer", minimum: 0 },
    closes: { type: "integer", minimum: 0 },
  },
  required: ["currentDepth", "opens", "closes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextDepth: { type: "integer" }, change: { type: "integer" } },
  required: ["nextDepth", "change"],
} as const;
/** Update an explicitly annotated narrative frame depth; opening/closing sequence validity is supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentDepth, opens, closes } = request;
  const compute = (): Output => {
    H.integer(currentDepth, 0);
    H.integer(opens, 0);
    H.integer(closes, 0, currentDepth + opens);
    return { nextDepth: currentDepth + opens - closes, change: opens - closes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentDepth: 1, opens: 2, closes: 1 },
  output: { nextDepth: 2, change: 1 },
} satisfies ToolExample<Input, Output>;
export const narratorFrameDepthChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/narrator-frame-depth-change",
    title: "Narrator Frame Depth Change Tool",
    description:
      "Update an explicitly annotated narrative frame depth; opening/closing sequence validity is supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentDepth: { type: "integer", minimum: 0 },
        opens: { type: "integer", minimum: 0 },
        closes: { type: "integer", minimum: 0 },
      },
      required: ["currentDepth", "opens", "closes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextDepth: { type: "integer" },
        change: { type: "integer" },
      },
      required: ["nextDepth", "change"],
    },
    ports: {
      inputs: [
        {
          id: "currentDepth",
          label: "Current Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "opens",
          label: "Opens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "closes",
          label: "Closes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextDepth",
          label: "Next Depth",
          valueType: { type: "integer" },
        },
        { id: "change", label: "Change", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = narratorFrameDepthChangeTool.execute;
export default narratorFrameDepthChangeTool;
