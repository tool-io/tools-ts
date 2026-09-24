import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousPosition: number;
  readonly currentPosition: number;
  readonly acceleration: number;
  readonly timeStep: number;
  readonly recordedNext: number;
};
export type Output = {
  readonly predictedNext: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousPosition: { type: "number" },
    currentPosition: { type: "number" },
    acceleration: { type: "number" },
    timeStep: { type: "number", minimum: 0 },
    recordedNext: { type: "number" },
  },
  required: [
    "previousPosition",
    "currentPosition",
    "acceleration",
    "timeStep",
    "recordedNext",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedNext: { type: "number" },
    residual: { type: "number" },
  },
  required: ["predictedNext", "residual"],
} as const;
/** Compare one supplied constant-step position-Verlet update with a recorded next position. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    previousPosition,
    currentPosition,
    acceleration,
    timeStep,
    recordedNext,
  } = request;
  const compute = (): Output => {
    H.domain(timeStep >= 0);
    return {
      predictedNext:
        2 * currentPosition - previousPosition + acceleration * timeStep ** 2,
      residual:
        recordedNext -
        (2 * currentPosition - previousPosition + acceleration * timeStep ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousPosition: 0,
    currentPosition: 2,
    acceleration: 1,
    timeStep: 1,
    recordedNext: 6,
  },
  output: { predictedNext: 5, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const verletPositionResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/verlet-position-residual",
    title: "Verlet Position Residual Tool",
    description:
      "Compare one supplied constant-step position-Verlet update with a recorded next position.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousPosition: { type: "number" },
        currentPosition: { type: "number" },
        acceleration: { type: "number" },
        timeStep: { type: "number", minimum: 0 },
        recordedNext: { type: "number" },
      },
      required: [
        "previousPosition",
        "currentPosition",
        "acceleration",
        "timeStep",
        "recordedNext",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedNext: { type: "number" },
        residual: { type: "number" },
      },
      required: ["predictedNext", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "previousPosition",
          label: "Previous Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentPosition",
          label: "Current Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acceleration",
          label: "Acceleration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeStep",
          label: "Time Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedNext",
          label: "Recorded Next",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedNext",
          label: "Predicted Next",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = verletPositionResidualTool.execute;
export default verletPositionResidualTool;
