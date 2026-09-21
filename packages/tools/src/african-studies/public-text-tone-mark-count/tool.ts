import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly suppliedToneMarks: readonly string[];
  readonly decompose: boolean;
};
export type Output = { readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    suppliedToneMarks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    decompose: { type: "boolean" },
  },
  required: ["text", "suppliedToneMarks", "decompose"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Count explicitly listed tone-mark code points with an optional canonical decomposition; no language inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, suppliedToneMarks, decompose } = request;
  const compute = (): Output => {
    H.domain(
      suppliedToneMarks.every((x) => [...x].length === 1) &&
        new Set(suppliedToneMarks).size === suppliedToneMarks.length,
    );
    return {
      count: [...(decompose ? text.normalize("NFD") : text)].filter((x) =>
        suppliedToneMarks.includes(x),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "áà", suppliedToneMarks: ["́", "̀"], decompose: true },
  output: { count: 2 },
} satisfies ToolExample<Input, Output>;
export const publicTextToneMarkCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/public-text-tone-mark-count",
    title: "Public Text Tone Mark Count Tool",
    description:
      "Count explicitly listed tone-mark code points with an optional canonical decomposition; no language inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        suppliedToneMarks: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        decompose: { type: "boolean" },
      },
      required: ["text", "suppliedToneMarks", "decompose"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedToneMarks",
          label: "Supplied Tone Marks",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "decompose",
          label: "Decompose",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicTextToneMarkCountTool.execute;
export default publicTextToneMarkCountTool;
