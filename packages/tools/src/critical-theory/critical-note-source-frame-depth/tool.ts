import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceDepth: number;
  readonly noteDepth: number;
};
export type Output = {
  readonly relativeDepth: number;
  readonly deeper: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDepth: { type: "integer", minimum: 0 },
    noteDepth: { type: "integer", minimum: 0 },
  },
  required: ["sourceDepth", "noteDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeDepth: { type: "integer" },
    deeper: { type: "boolean" },
  },
  required: ["relativeDepth", "deeper"],
} as const;
/** Calculate critical note source frame depth from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceDepth, noteDepth } = request;
  const compute = (): Output => {
    H.integer(sourceDepth, 0);
    H.integer(noteDepth, 0);
    return {
      relativeDepth: noteDepth - sourceDepth,
      deeper: noteDepth > sourceDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceDepth: 1, noteDepth: 3 },
  output: { relativeDepth: 2, deeper: true },
} satisfies ToolExample<Input, Output>;
export const criticalNoteSourceFrameDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/critical-note-source-frame-depth",
    title: "Critical Note Source Frame Depth Tool",
    description:
      "Calculate critical note source frame depth from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceDepth: { type: "integer", minimum: 0 },
        noteDepth: { type: "integer", minimum: 0 },
      },
      required: ["sourceDepth", "noteDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeDepth: { type: "integer" },
        deeper: { type: "boolean" },
      },
      required: ["relativeDepth", "deeper"],
    },
    ports: {
      inputs: [
        {
          id: "sourceDepth",
          label: "Source Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "noteDepth",
          label: "Note Depth",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "relativeDepth",
          label: "Relative Depth",
          valueType: { type: "integer" },
        },
        { id: "deeper", label: "Deeper", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = criticalNoteSourceFrameDepthTool.execute;
export default criticalNoteSourceFrameDepthTool;
