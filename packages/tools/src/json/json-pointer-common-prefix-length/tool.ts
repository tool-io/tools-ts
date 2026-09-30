import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPointer: string;
  readonly secondPointer: string;
};
export type Output = { readonly commonSegments: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPointer: { type: "string", maxLength: 8192 },
    secondPointer: { type: "string", maxLength: 8192 },
  },
  required: ["firstPointer", "secondPointer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { commonSegments: { type: "integer" } },
  required: ["commonSegments"],
} as const;
/** Calculate json pointer common prefix length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPointer, secondPointer } = request;
  const compute = (): Output => {
    const parse = (s: string) => {
      H.domain(s === "" || s.startsWith("/"));
      return s === ""
        ? []
        : s
            .slice(1)
            .split("/")
            .map((t) => {
              H.domain(!/~(?![01])/.test(t));
              return t.replace(/~1/g, "/").replace(/~0/g, "~");
            });
    };
    const a = parse(firstPointer),
      b = parse(secondPointer);
    let commonSegments = 0;
    while (
      commonSegments < a.length &&
      commonSegments < b.length &&
      a[commonSegments] === b[commonSegments]
    )
      commonSegments++;
    return { commonSegments };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPointer: "/a/b", secondPointer: "/a/c" },
  output: { commonSegments: 1 },
} satisfies ToolExample<Input, Output>;
export const jsonPointerCommonPrefixLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-pointer-common-prefix-length",
    title: "JSON Pointer Common Prefix Length Tool",
    description:
      "Calculate json pointer common prefix length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPointer: { type: "string", maxLength: 8192 },
        secondPointer: { type: "string", maxLength: 8192 },
      },
      required: ["firstPointer", "secondPointer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { commonSegments: { type: "integer" } },
      required: ["commonSegments"],
    },
    ports: {
      inputs: [
        {
          id: "firstPointer",
          label: "First Pointer",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondPointer",
          label: "Second Pointer",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "commonSegments",
          label: "Common Segments",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonPointerCommonPrefixLengthTool.execute;
export default jsonPointerCommonPrefixLengthTool;
