import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly mirrorX: boolean;
  readonly mirrorY: boolean;
  readonly mirrorZ: boolean;
};
export type Output = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    z: { type: "number" },
    mirrorX: { type: "boolean" },
    mirrorY: { type: "boolean" },
    mirrorZ: { type: "boolean" },
  },
  required: ["x", "y", "z", "mirrorX", "mirrorY", "mirrorZ"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    z: { type: "number" },
  },
  required: ["x", "y", "z"],
} as const;
/** Reflect supplied phantom coordinates about origin planes without planning surgery. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, z, mirrorX, mirrorY, mirrorZ } = request;
  const compute = (): Output => {
    return {
      x: x * (mirrorX ? -1 : 1),
      y: y * (mirrorY ? -1 : 1),
      z: z * (mirrorZ ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 1, y: 2, z: 3, mirrorX: true, mirrorY: false, mirrorZ: false },
  output: { x: -1, y: 2, z: 3 },
} satisfies ToolExample<Input, Output>;
export const jawPhantomMirrorAxisSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/jaw-phantom-mirror-axis-sign",
    title: "Jaw Phantom Mirror Axis Sign Tool",
    description:
      "Reflect supplied phantom coordinates about origin planes without planning surgery.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        z: { type: "number" },
        mirrorX: { type: "boolean" },
        mirrorY: { type: "boolean" },
        mirrorZ: { type: "boolean" },
      },
      required: ["x", "y", "z", "mirrorX", "mirrorY", "mirrorZ"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        z: { type: "number" },
      },
      required: ["x", "y", "z"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
        { id: "z", label: "Z", required: true, valueType: { type: "number" } },
        {
          id: "mirrorX",
          label: "Mirror X",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "mirrorY",
          label: "Mirror Y",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "mirrorZ",
          label: "Mirror Z",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "x", label: "X", valueType: { type: "number" } },
        { id: "y", label: "Y", valueType: { type: "number" } },
        { id: "z", label: "Z", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = jawPhantomMirrorAxisSignTool.execute;
export default jawPhantomMirrorAxisSignTool;
