import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly centralAngle: number };
export type Output = { readonly tangentChordAngle: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { centralAngle: { type: "number", minimum: 0 } },
  required: ["centralAngle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tangentChordAngle: { type: "number" } },
  required: ["tangentChordAngle"],
} as const;
/** Calculate circle tangent chord angle from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { centralAngle } = input;
  const compute = (): Output => {
    H.domain(centralAngle >= 0 && centralAngle <= 2 * Math.PI);
    return { tangentChordAngle: centralAngle / 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { centralAngle: 1.5707963267948966 },
  output: { tangentChordAngle: 0.7853981633974483 },
} satisfies ToolExample<Input, Output>;
export const circleTangentChordAngleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/circle-tangent-chord-angle",
    title: "Circle Tangent Chord Angle Tool",
    description:
      "Calculate circle tangent chord angle from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { centralAngle: { type: "number", minimum: 0 } },
      required: ["centralAngle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tangentChordAngle: { type: "number" } },
      required: ["tangentChordAngle"],
    },
    ports: {
      inputs: [
        {
          id: "centralAngle",
          label: "Central Angle",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tangentChordAngle",
          label: "Tangent Chord Angle",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = circleTangentChordAngleTool.execute;
export default circleTangentChordAngleTool;
