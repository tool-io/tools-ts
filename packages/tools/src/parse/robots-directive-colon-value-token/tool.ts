import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly line: string };
export type Output = { readonly directive: string; readonly value: string };
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
    directive: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192 },
  },
  required: ["directive", "value"],
} as const;
/** Calculate robots directive colon value token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { line } = request;
  const compute = (): Output => {
    const r = /^([A-Za-z][A-Za-z-]*)[ \t]*:[ \t]*([^\r\n]*)(?![\s\S])/.exec(
      line,
    );
    H.domain(r !== null);
    return {
      directive: r[1].toLowerCase(),
      value: r[2].replace(/#.*/, "").trim(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { line: "Disallow: /private # comment" },
  output: { directive: "disallow", value: "/private" },
} satisfies ToolExample<Input, Output>;
export const robotsDirectiveColonValueTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/robots-directive-colon-value-token",
    title: "Robots Directive Colon Value Token Tool",
    description:
      "Calculate robots directive colon value token from explicit caller-supplied inputs.",
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
        directive: { type: "string", maxLength: 8192 },
        value: { type: "string", maxLength: 8192 },
      },
      required: ["directive", "value"],
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
        { id: "directive", label: "Directive", valueType: { type: "string" } },
        { id: "value", label: "Value", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = robotsDirectiveColonValueTokenTool.execute;
export default robotsDirectiveColonValueTokenTool;
