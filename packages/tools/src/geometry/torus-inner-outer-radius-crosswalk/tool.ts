import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inner: number; readonly outer: number };
export type Output = { readonly major: number; readonly minor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inner: { type: "number", minimum: 0 },
    outer: { type: "number" },
  },
  required: ["inner", "outer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { major: { type: "number" }, minor: { type: "number" } },
  required: ["major", "minor"],
} as const;
/** Calculate torus inner outer radius crosswalk from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { inner, outer } = input;
  const compute = (): Output => {
    H.domain(inner >= 0 && outer > inner);
    return { major: (inner + outer) / 2, minor: (outer - inner) / 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inner: 2, outer: 6 },
  output: { major: 4, minor: 2 },
} satisfies ToolExample<Input, Output>;
export const torusInnerOuterRadiusCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/torus-inner-outer-radius-crosswalk",
    title: "Torus Inner Outer Radius Crosswalk Tool",
    description:
      "Calculate torus inner outer radius crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inner: { type: "number", minimum: 0 },
        outer: { type: "number" },
      },
      required: ["inner", "outer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { major: { type: "number" }, minor: { type: "number" } },
      required: ["major", "minor"],
    },
    ports: {
      inputs: [
        {
          id: "inner",
          label: "Inner",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outer",
          label: "Outer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "major", label: "Major", valueType: { type: "number" } },
        { id: "minor", label: "Minor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = torusInnerOuterRadiusCrosswalkTool.execute;
export default torusInnerOuterRadiusCrosswalkTool;
