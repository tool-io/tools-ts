import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly constant: number;
  readonly xCoefficient: number;
  readonly yCoefficient: number;
  readonly crossCoefficient: number;
  readonly targetLevel: number;
};
export type Output = {
  readonly saddleX: number;
  readonly saddleY: number;
  readonly saddleValue: number;
  readonly targetSide: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    constant: { type: "number" },
    xCoefficient: { type: "number" },
    yCoefficient: { type: "number" },
    crossCoefficient: { type: "number" },
    targetLevel: { type: "number" },
  },
  required: [
    "constant",
    "xCoefficient",
    "yCoefficient",
    "crossCoefficient",
    "targetLevel",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saddleX: { type: "number" },
    saddleY: { type: "number" },
    saddleValue: { type: "number" },
    targetSide: { type: "integer" },
  },
  required: ["saddleX", "saddleY", "saddleValue", "targetSide"],
} as const;
/** Stationary saddle and sign of a target level relative to its value for a+bx+cy+dxy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    constant,
    xCoefficient,
    yCoefficient,
    crossCoefficient,
    targetLevel,
  } = request;
  const compute = (): Output => {
    H.domain(crossCoefficient !== 0);
    return {
      saddleX: -yCoefficient / crossCoefficient,
      saddleY: -xCoefficient / crossCoefficient,
      saddleValue: constant - (xCoefficient * yCoefficient) / crossCoefficient,
      targetSide: Math.sign(
        targetLevel -
          (constant - (xCoefficient * yCoefficient) / crossCoefficient),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    constant: 1,
    xCoefficient: 2,
    yCoefficient: 3,
    crossCoefficient: 2,
    targetLevel: 0,
  },
  output: { saddleX: -1.5, saddleY: -1, saddleValue: -2, targetSide: 1 },
} satisfies ToolExample<Input, Output>;
export const bilinearLevelSetSaddleSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/bilinear-level-set-saddle-sign",
    title: "Bilinear Level Set Saddle Sign Tool",
    description:
      "Stationary saddle and sign of a target level relative to its value for a+bx+cy+dxy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        constant: { type: "number" },
        xCoefficient: { type: "number" },
        yCoefficient: { type: "number" },
        crossCoefficient: { type: "number" },
        targetLevel: { type: "number" },
      },
      required: [
        "constant",
        "xCoefficient",
        "yCoefficient",
        "crossCoefficient",
        "targetLevel",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saddleX: { type: "number" },
        saddleY: { type: "number" },
        saddleValue: { type: "number" },
        targetSide: { type: "integer" },
      },
      required: ["saddleX", "saddleY", "saddleValue", "targetSide"],
    },
    ports: {
      inputs: [
        {
          id: "constant",
          label: "Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "xCoefficient",
          label: "X Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yCoefficient",
          label: "Y Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crossCoefficient",
          label: "Cross Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetLevel",
          label: "Target Level",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "saddleX", label: "Saddle X", valueType: { type: "number" } },
        { id: "saddleY", label: "Saddle Y", valueType: { type: "number" } },
        {
          id: "saddleValue",
          label: "Saddle Value",
          valueType: { type: "number" },
        },
        {
          id: "targetSide",
          label: "Target Side",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = bilinearLevelSetSaddleSignTool.execute;
export default bilinearLevelSetSaddleSignTool;
