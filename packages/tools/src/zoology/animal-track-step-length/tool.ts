import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
};
export type Output = { readonly stepLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
  },
  required: ["firstX", "firstY", "secondX", "secondY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stepLength: { type: "number" } },
  required: ["stepLength"],
} as const;
/** Calculate animal track step length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY } = request;
  const compute = (): Output => {
    return { stepLength: Math.hypot(secondX - firstX, secondY - firstY) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 1, firstY: 2, secondX: 4, secondY: 6 },
  output: { stepLength: 5 },
} satisfies ToolExample<Input, Output>;
export const animalTrackStepLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-track-step-length",
    title: "Animal Track Step Length Tool",
    description:
      "Calculate animal track step length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
      },
      required: ["firstX", "firstY", "secondX", "secondY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stepLength: { type: "number" } },
      required: ["stepLength"],
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
      ],
      outputs: [
        {
          id: "stepLength",
          label: "Step Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalTrackStepLengthTool.execute;
export default animalTrackStepLengthTool;
