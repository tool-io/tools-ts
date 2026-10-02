import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
  readonly suppliedScale: number;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstX", "firstY", "secondX", "secondY", "suppliedScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Calculate stage mark distance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY, suppliedScale } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      distance: Math.hypot(secondX - firstX, secondY - firstY) * suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 0, firstY: 0, secondX: 3, secondY: 4, suppliedScale: 2 },
  output: { distance: 10 },
} satisfies ToolExample<Input, Output>;
export const stageMarkDistanceTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "performing-arts/stage-mark-distance",
    title: "Stage Mark Distance Tool",
    description:
      "Calculate stage mark distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstX", "firstY", "secondX", "secondY", "suppliedScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "firstX",
          label: "First X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstY",
          label: "First Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondX",
          label: "Second X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondY",
          label: "Second Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stageMarkDistanceTool.execute;
export default stageMarkDistanceTool;
