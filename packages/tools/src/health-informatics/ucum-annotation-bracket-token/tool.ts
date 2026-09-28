import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly code: string };
export type Output = {
  readonly base: string;
  readonly annotation: string;
  readonly annotated: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "string", maxLength: 8192 },
    annotation: { type: "string", maxLength: 8192 },
    annotated: { type: "boolean" },
  },
  required: ["base", "annotation", "annotated"],
} as const;
/** Split one terminal UCUM annotation from its code without interpreting unit algebra or validating the unit vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code } = request;
  const compute = (): Output => {
    H.domain(code.length > 0, "code");
    const open = code.indexOf("{");
    if (open < 0) {
      H.domain(!/[{}]/.test(code));
      return { base: code, annotation: "", annotated: false };
    }
    H.domain(
      code.endsWith("}") &&
        code.indexOf("{", open + 1) < 0 &&
        code.indexOf("}") === code.length - 1,
    );
    const base = code.slice(0, open),
      annotation = code.slice(open + 1, -1);
    H.domain(base.length > 0 && annotation.length > 0);
    return { base, annotation, annotated: true };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { code: "mg{creatinine}" },
  output: { base: "mg", annotation: "creatinine", annotated: true },
} satisfies ToolExample<Input, Output>;
export const ucumAnnotationBracketTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/ucum-annotation-bracket-token",
    title: "UCUM Annotation Bracket Token Tool",
    description:
      "Split one terminal UCUM annotation from its code without interpreting unit algebra or validating the unit vocabulary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "string", maxLength: 8192 },
        annotation: { type: "string", maxLength: 8192 },
        annotated: { type: "boolean" },
      },
      required: ["base", "annotation", "annotated"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "base", label: "Base", valueType: { type: "string" } },
        {
          id: "annotation",
          label: "Annotation",
          valueType: { type: "string" },
        },
        { id: "annotated", label: "Annotated", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ucumAnnotationBracketTokenTool.execute;
export default ucumAnnotationBracketTokenTool;
