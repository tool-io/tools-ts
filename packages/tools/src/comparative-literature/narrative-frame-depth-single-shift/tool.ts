import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly depth: number; readonly action: string };
export type Output = { readonly nextDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "integer", minimum: 0 },
    action: {
      type: "string",
      maxLength: 8192,
      enum: ["enter", "leave", "stay"],
    },
  },
  required: ["depth", "action"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextDepth: { type: "integer" } },
  required: ["nextDepth"],
} as const;
/** Calculate narrative frame depth single shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depth, action } = request;
  const compute = (): Output => {
    H.integer(depth, 0);
    H.domain(["enter", "leave", "stay"].includes(action));
    H.domain(
      action !== "leave" || depth > 0,
      "depth",
      "Cannot leave a frame at depth zero.",
    );
    return {
      nextDepth: depth + (action === "enter" ? 1 : action === "leave" ? -1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depth: 2, action: "enter" },
  output: { nextDepth: 3 },
} satisfies ToolExample<Input, Output>;
export const narrativeFrameDepthSingleShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/narrative-frame-depth-single-shift",
    title: "Narrative Frame Depth Single Shift Tool",
    description:
      "Calculate narrative frame depth single shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer", minimum: 0 },
        action: {
          type: "string",
          maxLength: 8192,
          enum: ["enter", "leave", "stay"],
        },
      },
      required: ["depth", "action"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nextDepth: { type: "integer" } },
      required: ["nextDepth"],
    },
    ports: {
      inputs: [
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "action",
          label: "Action",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "nextDepth",
          label: "Next Depth",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = narrativeFrameDepthSingleShiftTool.execute;
export default narrativeFrameDepthSingleShiftTool;
