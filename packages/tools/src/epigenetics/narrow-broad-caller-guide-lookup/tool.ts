import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    reference: exactLookup(i.key, {
      sharp:
        "Narrow-peak calling is commonly appropriate for localized enrichment such as many transcription factors or H3K4me3, subject to assay context.",
      diffuse:
        "Broad-peak calling is commonly appropriate for extended enrichment such as H3K27me3, subject to assay context.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "sharp" },
  output: {
    result: {
      reference:
        "Narrow-peak calling is commonly appropriate for localized enrichment such as many transcription factors or H3K4me3, subject to assay context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "epigenetics/narrow-broad-caller-guide-lookup",
  title: "Narrow versus Broad Peak Caller Selection Guide by Mark Lookup",
  description:
    "Retrieve a restricted peak-geometry caller-selection guide without processing reads. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
