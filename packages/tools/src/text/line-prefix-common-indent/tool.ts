import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lines: readonly string[] };
export type Output = { readonly commonIndent: string; readonly units: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lines: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["lines"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonIndent: { type: "string", maxLength: 8192 },
    units: { type: "integer" },
  },
  required: ["commonIndent", "units"],
} as const;
/** Find a literal common space/tab prefix without expanding tabs or excluding blank lines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lines } = request;
  const compute = (): Output => {
    H.domain(lines.length > 0);
    const indents = lines.map((x) => /^[\t ]*/.exec(x)?.[0] ?? "");
    let commonIndent = indents[0];
    while (!indents.every((x) => x.startsWith(commonIndent)))
      commonIndent = commonIndent.slice(0, -1);
    return { commonIndent, units: commonIndent.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lines: ["  a", "    b"] },
  output: { commonIndent: "  ", units: 2 },
} satisfies ToolExample<Input, Output>;
export const linePrefixCommonIndentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/line-prefix-common-indent",
    title: "Line Prefix Common Indent Tool",
    description:
      "Find a literal common space/tab prefix without expanding tabs or excluding blank lines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lines: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["lines"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commonIndent: { type: "string", maxLength: 8192 },
        units: { type: "integer" },
      },
      required: ["commonIndent", "units"],
    },
    ports: {
      inputs: [
        {
          id: "lines",
          label: "Lines",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "commonIndent",
          label: "Common Indent",
          valueType: { type: "string" },
        },
        { id: "units", label: "Units", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = linePrefixCommonIndentTool.execute;
export default linePrefixCommonIndentTool;
