import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
};
export type Output = {
  readonly xOffset: number;
  readonly yOffset: number;
  readonly magnitude: number;
};
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
  properties: {
    xOffset: { type: "number" },
    yOffset: { type: "number" },
    magnitude: { type: "number" },
  },
  required: ["xOffset", "yOffset", "magnitude"],
} as const;
/** Calculate classroom print registration offset pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY } = request;
  const compute = (): Output => {
    return {
      xOffset: secondX - firstX,
      yOffset: secondY - firstY,
      magnitude: Math.hypot(secondX - firstX, secondY - firstY),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 1, firstY: 2, secondX: 4, secondY: 6 },
  output: { xOffset: 3, yOffset: 4, magnitude: 5 },
} satisfies ToolExample<Input, Output>;
export const classroomPrintRegistrationOffsetPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-education/classroom-print-registration-offset-pair",
      title: "Classroom Print Registration Offset Pair Tool",
      description:
        "Calculate classroom print registration offset pair from explicit caller-supplied inputs.",
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
        properties: {
          xOffset: { type: "number" },
          yOffset: { type: "number" },
          magnitude: { type: "number" },
        },
        required: ["xOffset", "yOffset", "magnitude"],
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
          { id: "xOffset", label: "X Offset", valueType: { type: "number" } },
          { id: "yOffset", label: "Y Offset", valueType: { type: "number" } },
          {
            id: "magnitude",
            label: "Magnitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = classroomPrintRegistrationOffsetPairTool.execute;
export default classroomPrintRegistrationOffsetPairTool;
