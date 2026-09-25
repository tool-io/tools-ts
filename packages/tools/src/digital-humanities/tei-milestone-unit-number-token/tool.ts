import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly unit: string; readonly number: string };
export type Output = { readonly fragment: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unit: { type: "string", maxLength: 8192 },
    number: { type: "string", maxLength: 8192 },
  },
  required: ["unit", "number"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fragment: { type: "string", maxLength: 8192 } },
  required: ["fragment"],
} as const;
/** Serialize one TEI milestone fragment with XML double-quoted attribute escaping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unit, number } = request;
  const compute = (): Output => {
    H.domain(
      /^[A-Za-z][A-Za-z0-9-]*(?![\s\S])/.test(unit),
      "unit",
      "Use an ASCII TEI unit token.",
    );
    H.domain(
      Array.from(number).every((c) => {
        const n = c.codePointAt(0) ?? 0;
        return (
          n === 9 ||
          n === 10 ||
          n === 13 ||
          (n >= 32 && n <= 0xd7ff) ||
          (n >= 0xe000 && n <= 0xfffd) ||
          (n >= 0x10000 && n <= 0x10ffff)
        );
      }),
      "number",
      "Use XML 1.0 characters without isolated surrogates.",
    );
    const escape = (x: string) =>
      x
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;")
        .replace(/\t/g, "&#9;")
        .replace(/\n/g, "&#10;")
        .replace(/\r/g, "&#13;");
    return {
      fragment: '<milestone unit="' + unit + '" n="' + escape(number) + '"/>',
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unit: "page", number: "12r" },
  output: { fragment: '<milestone unit="page" n="12r"/>' },
} satisfies ToolExample<Input, Output>;
export const teiMilestoneUnitNumberTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/tei-milestone-unit-number-token",
    title: "TEI Milestone Unit Number Token Tool",
    description:
      "Serialize one TEI milestone fragment with XML double-quoted attribute escaping.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unit: { type: "string", maxLength: 8192 },
        number: { type: "string", maxLength: 8192 },
      },
      required: ["unit", "number"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fragment: { type: "string", maxLength: 8192 } },
      required: ["fragment"],
    },
    ports: {
      inputs: [
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "number",
          label: "Number",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "fragment", label: "Fragment", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = teiMilestoneUnitNumberTokenTool.execute;
export default teiMilestoneUnitNumberTokenTool;
