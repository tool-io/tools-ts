import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly tag: string };
export type Output = {
  readonly language: string;
  readonly extlangs: readonly string[];
  readonly remainder: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    language: { type: "string", maxLength: 8192 },
    extlangs: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    remainder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["language", "extlangs", "remainder"],
} as const;
/** Compute bcp 47 extlang subtag boundary from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { tag } = input;
  const compute = (): Output => {
    const parts = tag.split("-");
    domain(
      /^[A-Za-z]{2,3}(?![\s\S])/.test(parts[0]) &&
        parts.slice(1).every((x) => /^[A-Za-z0-9]{1,8}(?![\s\S])/.test(x)),
    );
    let i = 1;
    while (
      i < parts.length &&
      i <= 3 &&
      /^[A-Za-z]{3}(?![\s\S])/.test(parts[i])
    )
      i++;
    return {
      language: parts[0],
      extlangs: parts.slice(1, i),
      remainder: parts.slice(i),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { tag: "zh-cmn-Hans-CN" },
  output: { language: "zh", extlangs: ["cmn"], remainder: ["Hans", "CN"] },
} satisfies ToolExample<Input, Output>;
export const bcp47ExtlangSubtagBoundaryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/bcp47-extlang-subtag-boundary",
  title: "BCP 47 Extlang Subtag Boundary Tool",
  description:
    "Compute bcp 47 extlang subtag boundary from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "tag",
        label: "Tag",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "language", label: "Language", valueType: { type: "string" } },
      {
        id: "extlangs",
        label: "Extlangs",
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "remainder",
        label: "Remainder",
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
  },
});
export const run = bcp47ExtlangSubtagBoundaryTool.execute;
export default bcp47ExtlangSubtagBoundaryTool;
