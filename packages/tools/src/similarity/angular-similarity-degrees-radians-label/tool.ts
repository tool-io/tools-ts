import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly angle: number; readonly inputUnit: string };
export type Output = { readonly radians: number; readonly degrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angle: { type: "number" },
    inputUnit: {
      type: "string",
      maxLength: 8192,
      enum: ["degrees", "radians"],
    },
  },
  required: ["angle", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radians: { type: "number" }, degrees: { type: "number" } },
  required: ["radians", "degrees"],
} as const;
/** Convert an explicit angular-similarity separation between degrees and radians without deriving it from vectors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angle, inputUnit } = request;
  const compute = (): Output => {
    H.domain(["degrees", "radians"].includes(inputUnit), "inputUnit");
    return {
      radians: inputUnit === "degrees" ? (angle * Math.PI) / 180 : angle,
      degrees: inputUnit === "radians" ? (angle * 180) / Math.PI : angle,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angle: 90, inputUnit: "degrees" },
  output: { radians: 1.5707963267948966, degrees: 90 },
} satisfies ToolExample<Input, Output>;
export const angularSimilarityDegreesRadiansLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["similarity", "mathematics"],
        keywords: ["similarity", "mathematics"],
      },
      id: "similarity/angular-similarity-degrees-radians-label",
      title: "Angular Similarity Degrees Radians Label",
      description:
        "Convert an explicit angular-similarity separation between degrees and radians without deriving it from vectors.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          angle: { type: "number" },
          inputUnit: {
            type: "string",
            maxLength: 8192,
            enum: ["degrees", "radians"],
          },
        },
        required: ["angle", "inputUnit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radians: { type: "number" },
          degrees: { type: "number" },
        },
        required: ["radians", "degrees"],
      },
      ports: {
        inputs: [
          {
            id: "angle",
            label: "Angle",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inputUnit",
            label: "Input Unit",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "radians", label: "Radians", valueType: { type: "number" } },
          { id: "degrees", label: "Degrees", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = angularSimilarityDegreesRadiansLabelTool.execute;
export default angularSimilarityDegreesRadiansLabelTool;
