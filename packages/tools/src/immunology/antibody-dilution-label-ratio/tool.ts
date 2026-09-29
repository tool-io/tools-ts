import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLabel: string;
  readonly secondLabel: string;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLabel: { type: "string", maxLength: 8192 },
    secondLabel: { type: "string", maxLength: 8192 },
  },
  required: ["firstLabel", "secondLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compare reciprocal dilution labels as explicit bench notation; no protocol or treatment advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLabel, secondLabel } = request;
  const compute = (): Output => {
    const parse = (s: string) => {
      const m = /^1:([1-9]\d*)(?![\s\S])/.exec(s);
      H.domain(m !== null, "label");
      const n = Number(m[1]);
      H.integer(n, 1);
      return n;
    };
    return { ratio: parse(secondLabel) / parse(firstLabel) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLabel: "1:100", secondLabel: "1:400" },
  output: { ratio: 4 },
} satisfies ToolExample<Input, Output>;
export const antibodyDilutionLabelRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/antibody-dilution-label-ratio",
    title: "Antibody Dilution Label Ratio Tool",
    description:
      "Compare reciprocal dilution labels as explicit bench notation; no protocol or treatment advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLabel: { type: "string", maxLength: 8192 },
        secondLabel: { type: "string", maxLength: 8192 },
      },
      required: ["firstLabel", "secondLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "firstLabel",
          label: "First Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondLabel",
          label: "Second Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = antibodyDilutionLabelRatioTool.execute;
export default antibodyDilutionLabelRatioTool;
