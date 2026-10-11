import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedDistance: number;
  readonly reverseNormal: boolean;
  readonly reflectPoint: boolean;
};
export type Output = { readonly resultingSignedDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDistance: { type: "number" },
    reverseNormal: { type: "boolean" },
    reflectPoint: { type: "boolean" },
  },
  required: ["signedDistance", "reverseNormal", "reflectPoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { resultingSignedDistance: { type: "number" } },
  required: ["resultingSignedDistance"],
} as const;
/** Apply explicit normal reversal and point-reflection sign policies to a supplied signed plane distance without locating the plane. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedDistance, reverseNormal, reflectPoint } = request;
  const compute = (): Output => {
    return {
      resultingSignedDistance:
        signedDistance * (reverseNormal ? -1 : 1) * (reflectPoint ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedDistance: 3, reverseNormal: true, reflectPoint: false },
  output: { resultingSignedDistance: -3 },
} satisfies ToolExample<Input, Output>;
export const vectorReflectionPlaneDistanceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["vector", "mathematics"],
      keywords: ["vector", "mathematics"],
    },
    id: "vector/vector-reflection-plane-distance-sign",
    title: "Vector Reflection Plane Distance Sign",
    description:
      "Apply explicit normal reversal and point-reflection sign policies to a supplied signed plane distance without locating the plane.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDistance: { type: "number" },
        reverseNormal: { type: "boolean" },
        reflectPoint: { type: "boolean" },
      },
      required: ["signedDistance", "reverseNormal", "reflectPoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { resultingSignedDistance: { type: "number" } },
      required: ["resultingSignedDistance"],
    },
    ports: {
      inputs: [
        {
          id: "signedDistance",
          label: "Signed Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseNormal",
          label: "Reverse Normal",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reflectPoint",
          label: "Reflect Point",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "resultingSignedDistance",
          label: "Resulting Signed Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorReflectionPlaneDistanceSignTool.execute;
export default vectorReflectionPlaneDistanceSignTool;
