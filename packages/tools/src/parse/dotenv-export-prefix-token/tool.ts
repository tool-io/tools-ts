import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly line: string };
export type Output = {
  readonly hasExportPrefix: boolean;
  readonly assignmentText: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasExportPrefix: { type: "boolean" },
    assignmentText: { type: "string", maxLength: 8192 },
  },
  required: ["hasExportPrefix", "assignmentText"],
} as const;
/** Remove one exact leading dotenv export keyword and horizontal whitespace without parsing or expanding the assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { line } = request;
  const compute = (): Output => {
    H.domain(!/[\r\n]/.test(line), "line");
    return (() => {
      const match = /^export[ \t]+/.exec(line);
      return {
        hasExportPrefix: match !== null,
        assignmentText: match ? line.slice(match[0].length) : line,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { line: "export KEY=value" },
  output: { hasExportPrefix: true, assignmentText: "KEY=value" },
} satisfies ToolExample<Input, Output>;
export const dotenvExportPrefixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["parse", "data parsing", "computer science"],
      keywords: ["data parsing", "computer science"],
    },
    id: "parse/dotenv-export-prefix-token",
    title: "Dotenv Export Prefix Token",
    description:
      "Remove one exact leading dotenv export keyword and horizontal whitespace without parsing or expanding the assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { line: { type: "string", maxLength: 8192 } },
      required: ["line"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasExportPrefix: { type: "boolean" },
        assignmentText: { type: "string", maxLength: 8192 },
      },
      required: ["hasExportPrefix", "assignmentText"],
    },
    ports: {
      inputs: [
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hasExportPrefix",
          label: "Has Export Prefix",
          valueType: { type: "boolean" },
        },
        {
          id: "assignmentText",
          label: "Assignment Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = dotenvExportPrefixTokenTool.execute;
export default dotenvExportPrefixTokenTool;
