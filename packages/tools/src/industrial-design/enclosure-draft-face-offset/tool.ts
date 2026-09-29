import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly height: number; readonly draftRadians: number };
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number", minimum: 0 },
    draftRadians: { type: "number" },
  },
  required: ["height", "draftRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Calculate enclosure draft face offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, draftRadians } = request;
  const compute = (): Output => {
    H.domain(height >= 0 && Math.abs(draftRadians) < Math.PI / 2);
    return { offset: height * Math.tan(draftRadians) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 10, draftRadians: 0.7853981633974483 },
  output: { offset: 9.999999999999998 },
} satisfies ToolExample<Input, Output>;
export const enclosureDraftFaceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/enclosure-draft-face-offset",
    title: "Enclosure Draft Face Offset Tool",
    description:
      "Calculate enclosure draft face offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        height: { type: "number", minimum: 0 },
        draftRadians: { type: "number" },
      },
      required: ["height", "draftRadians"],
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
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "draftRadians",
          label: "Draft Radians",
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
export const run = enclosureDraftFaceOffsetTool.execute;
export default enclosureDraftFaceOffsetTool;
