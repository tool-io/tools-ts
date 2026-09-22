import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly module: number; readonly course: number };
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    module: { type: "number", exclusiveMinimum: 0 },
    course: { type: "integer", minimum: 0 },
  },
  required: ["module", "course"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Calculate brick bond half module offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { module, course } = request;
  const compute = (): Output => {
    H.positive(module);
    H.integer(course, 0);
    return { offset: course % 2 === 0 ? 0 : module / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { module: 0.24, course: 3 },
  output: { offset: 0.12 },
} satisfies ToolExample<Input, Output>;
export const brickBondHalfModuleOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/brick-bond-half-module-offset",
    title: "Brick Bond Half Module Offset Tool",
    description:
      "Calculate brick bond half module offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        module: { type: "number", exclusiveMinimum: 0 },
        course: { type: "integer", minimum: 0 },
      },
      required: ["module", "course"],
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
          id: "module",
          label: "Module",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "course",
          label: "Course",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = brickBondHalfModuleOffsetTool.execute;
export default brickBondHalfModuleOffsetTool;
