import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massKilograms: number;
  readonly firstFrameVelocity: number;
  readonly relativeFrameVelocity: number;
};
export type Output = {
  readonly secondFrameVelocity: number;
  readonly secondFrameMomentum: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massKilograms: { type: "number", minimum: 0 },
    firstFrameVelocity: { type: "number" },
    relativeFrameVelocity: { type: "number" },
  },
  required: ["massKilograms", "firstFrameVelocity", "relativeFrameVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondFrameVelocity: { type: "number" },
    secondFrameMomentum: { type: "number" },
  },
  required: ["secondFrameVelocity", "secondFrameMomentum"],
} as const;
/** Apply an explicit one-axis Galilean velocity shift and calculate classical momentum without relativistic transformation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massKilograms, firstFrameVelocity, relativeFrameVelocity } = request;
  const compute = (): Output => {
    H.domain(massKilograms >= 0, "massKilograms");
    return {
      secondFrameVelocity: firstFrameVelocity - relativeFrameVelocity,
      secondFrameMomentum:
        massKilograms * (firstFrameVelocity - relativeFrameVelocity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { massKilograms: 2, firstFrameVelocity: 5, relativeFrameVelocity: 3 },
  output: { secondFrameVelocity: 2, secondFrameMomentum: 4 },
} satisfies ToolExample<Input, Output>;
export const momentumTwoFrameSingleAxisShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physics"],
      keywords: ["physics"],
    },
    id: "physics/momentum-two-frame-single-axis-shift",
    title: "Momentum Two Frame Single Axis Shift",
    description:
      "Apply an explicit one-axis Galilean velocity shift and calculate classical momentum without relativistic transformation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massKilograms: { type: "number", minimum: 0 },
        firstFrameVelocity: { type: "number" },
        relativeFrameVelocity: { type: "number" },
      },
      required: [
        "massKilograms",
        "firstFrameVelocity",
        "relativeFrameVelocity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondFrameVelocity: { type: "number" },
        secondFrameMomentum: { type: "number" },
      },
      required: ["secondFrameVelocity", "secondFrameMomentum"],
    },
    ports: {
      inputs: [
        {
          id: "massKilograms",
          label: "Mass Kilograms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstFrameVelocity",
          label: "First Frame Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "relativeFrameVelocity",
          label: "Relative Frame Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "secondFrameVelocity",
          label: "Second Frame Velocity",
          valueType: { type: "number" },
        },
        {
          id: "secondFrameMomentum",
          label: "Second Frame Momentum",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = momentumTwoFrameSingleAxisShiftTool.execute;
export default momentumTwoFrameSingleAxisShiftTool;
