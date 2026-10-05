import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectVelocity: number;
  readonly frameVelocity: number;
};
export type Output = { readonly relativeVelocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectVelocity: { type: "number" },
    frameVelocity: { type: "number" },
  },
  required: ["objectVelocity", "frameVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeVelocity: { type: "number" } },
  required: ["relativeVelocity"],
} as const;
/** Return the Galilean object velocity along one axis relative to a translating frame on that axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectVelocity, frameVelocity } = request;
  const compute = (): Output => {
    return { relativeVelocity: objectVelocity - frameVelocity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objectVelocity: 12, frameVelocity: 5 },
  output: { relativeVelocity: 7 },
} satisfies ToolExample<Input, Output>;
export const relativeVelocityAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/relative-velocity-axis",
    title: "Relative Velocity Axis Tool",
    description:
      "Return the Galilean object velocity along one axis relative to a translating frame on that axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectVelocity: { type: "number" },
        frameVelocity: { type: "number" },
      },
      required: ["objectVelocity", "frameVelocity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeVelocity: { type: "number" } },
      required: ["relativeVelocity"],
    },
    ports: {
      inputs: [
        {
          id: "objectVelocity",
          label: "Object Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frameVelocity",
          label: "Frame Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeVelocity",
          label: "Relative Velocity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = relativeVelocityAxisTool.execute;
export default relativeVelocityAxisTool;
