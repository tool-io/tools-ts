import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetX: number;
  readonly targetY: number;
  readonly printedX: number;
  readonly printedY: number;
};
export type Output = {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly magnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetX: { type: "number" },
    targetY: { type: "number" },
    printedX: { type: "number" },
    printedY: { type: "number" },
  },
  required: ["targetX", "targetY", "printedX", "printedY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetX: { type: "number" },
    offsetY: { type: "number" },
    magnitude: { type: "number" },
  },
  required: ["offsetX", "offsetY", "magnitude"],
} as const;
/** Calculate supplied printed-minus-target registration offset vector and Euclidean magnitude in a shared coordinate frame. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetX, targetY, printedX, printedY } = request;
  const compute = (): Output => {
    return {
      offsetX: printedX - targetX,
      offsetY: printedY - targetY,
      magnitude: Math.hypot(printedX - targetX, printedY - targetY),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetX: 12, targetY: 5, printedX: 15, printedY: 9 },
  output: { offsetX: 3, offsetY: 4, magnitude: 5 },
} satisfies ToolExample<Input, Output>;
export const printRegistrationTargetOffsetVectorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graphic-design/print-registration-target-offset-vector",
      title: "Print Registration Target Offset Vector Tool",
      description:
        "Calculate supplied printed-minus-target registration offset vector and Euclidean magnitude in a shared coordinate frame.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetX: { type: "number" },
          targetY: { type: "number" },
          printedX: { type: "number" },
          printedY: { type: "number" },
        },
        required: ["targetX", "targetY", "printedX", "printedY"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          offsetX: { type: "number" },
          offsetY: { type: "number" },
          magnitude: { type: "number" },
        },
        required: ["offsetX", "offsetY", "magnitude"],
      },
      ports: {
        inputs: [
          {
            id: "targetX",
            label: "Target X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetY",
            label: "Target Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "printedX",
            label: "Printed X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "printedY",
            label: "Printed Y",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "offsetX", label: "Offset X", valueType: { type: "number" } },
          { id: "offsetY", label: "Offset Y", valueType: { type: "number" } },
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
export const run = printRegistrationTargetOffsetVectorTool.execute;
export default printRegistrationTargetOffsetVectorTool;
