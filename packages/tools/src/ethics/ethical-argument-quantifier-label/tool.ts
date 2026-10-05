import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantifier: string;
  readonly variable: string;
  readonly proposition: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantifier: {
      type: "string",
      maxLength: 8192,
      enum: ["all", "some", "none"],
    },
    variable: { type: "string", maxLength: 8192 },
    proposition: { type: "string", maxLength: 8192 },
  },
  required: ["quantifier", "variable", "proposition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render an explicitly selected quantifier over a literal proposition without performing logical inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantifier, variable, proposition } = request;
  const compute = (): Output => {
    H.domain(["all", "some", "none"].includes(quantifier), "quantifier");
    H.domain(/^[A-Za-z][A-Za-z0-9_]*(?![\s\S])/.test(variable), "variable");
    H.domain(proposition.length > 0, "proposition");
    return {
      label:
        quantifier === "all"
          ? "∀" + variable + " (" + proposition + ")"
          : quantifier === "some"
            ? "∃" + variable + " (" + proposition + ")"
            : "¬∃" + variable + " (" + proposition + ")",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantifier: "all", variable: "x", proposition: "P(x)" },
  output: { label: "∀x (P(x))" },
} satisfies ToolExample<Input, Output>;
export const ethicalArgumentQuantifierLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/ethical-argument-quantifier-label",
    title: "Ethical Argument Quantifier Label Tool",
    description:
      "Render an explicitly selected quantifier over a literal proposition without performing logical inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantifier: {
          type: "string",
          maxLength: 8192,
          enum: ["all", "some", "none"],
        },
        variable: { type: "string", maxLength: 8192 },
        proposition: { type: "string", maxLength: 8192 },
      },
      required: ["quantifier", "variable", "proposition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "quantifier",
          label: "Quantifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "variable",
          label: "Variable",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "proposition",
          label: "Proposition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ethicalArgumentQuantifierLabelTool.execute;
export default ethicalArgumentQuantifierLabelTool;
