import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly upperCase: boolean };
export type Output = {
  readonly transformed: string;
  readonly exponentPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    upperCase: { type: "boolean" },
  },
  required: ["token", "upperCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transformed: { type: "string", maxLength: 8192 },
    exponentPresent: { type: "boolean" },
  },
  required: ["transformed", "exponentPresent"],
} as const;
/** Change only a valid supplied decimal token’s exponent-marker case, preserving all other spelling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, upperCase } = request;
  const compute = (): Output => {
    H.domain(
      /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?![\s\S])/.test(token),
      "token",
    );
    return {
      transformed: token.replace(/[eE]/, upperCase ? "E" : "e"),
      exponentPresent: /[eE]/.test(token),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "1.20e+03", upperCase: true },
  output: { transformed: "1.20E+03", exponentPresent: true },
} satisfies ToolExample<Input, Output>;
export const exponentMarkerCaseTransformTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/exponent-marker-case-transform",
    title: "Exponent Marker Case Transform Tool",
    description:
      "Change only a valid supplied decimal token’s exponent-marker case, preserving all other spelling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        upperCase: { type: "boolean" },
      },
      required: ["token", "upperCase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transformed: { type: "string", maxLength: 8192 },
        exponentPresent: { type: "boolean" },
      },
      required: ["transformed", "exponentPresent"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "upperCase",
          label: "Upper Case",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "transformed",
          label: "Transformed",
          valueType: { type: "string" },
        },
        {
          id: "exponentPresent",
          label: "Exponent Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = exponentMarkerCaseTransformTool.execute;
export default exponentMarkerCaseTransformTool;
