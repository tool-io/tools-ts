import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly mantissaWidth: number;
  readonly exponentWidth: number;
  readonly exponentPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mantissaWidth: { type: "integer" },
    exponentWidth: { type: "integer" },
    exponentPresent: { type: "boolean" },
  },
  required: ["mantissaWidth", "exponentWidth", "exponentPresent"],
} as const;
/** Count literal ASCII numeric-field widths including signs and decimal point, without converting or normalizing the number. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const a =
      /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:[eE]([+-]?\d+))?(?![\s\S])/.exec(
        token,
      );
    H.domain(a, "token");
    return {
      mantissaWidth: a[1].length,
      exponentWidth: (a[2] ?? "").length,
      exponentPresent: a[2] !== undefined,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "-1.20e+03" },
  output: { mantissaWidth: 5, exponentWidth: 3, exponentPresent: true },
} satisfies ToolExample<Input, Output>;
export const mantissaExponentFieldWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/mantissa-exponent-field-width",
    title: "Mantissa Exponent Field Width Tool",
    description:
      "Count literal ASCII numeric-field widths including signs and decimal point, without converting or normalizing the number.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mantissaWidth: { type: "integer" },
        exponentWidth: { type: "integer" },
        exponentPresent: { type: "boolean" },
      },
      required: ["mantissaWidth", "exponentWidth", "exponentPresent"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "mantissaWidth",
          label: "Mantissa Width",
          valueType: { type: "integer" },
        },
        {
          id: "exponentWidth",
          label: "Exponent Width",
          valueType: { type: "integer" },
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
export const run = mantissaExponentFieldWidthTool.execute;
export default mantissaExponentFieldWidthTool;
