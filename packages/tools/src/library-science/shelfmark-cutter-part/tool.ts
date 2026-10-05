import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly shelfmark: string };
export type Output = { readonly cutter: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shelfmark: { type: "string", maxLength: 8192 } },
  required: ["shelfmark"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cutter: { type: "string", maxLength: 8192 } },
  required: ["cutter"],
} as const;
/** Extract the first uppercase letter plus one-to-six-digit Cutter-shaped token at an explicit shelfmark token boundary; no classification schedule is consulted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shelfmark } = request;
  const compute = (): Output => {
    const match = /(?:^|\s|\.)([A-Z][0-9]{1,6})(?=\s|$|\.)/.exec(shelfmark);
    H.domain(match, "shelfmark");
    return { cutter: match[1] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shelfmark: "QA76.73 .J38 2020" },
  output: { cutter: "J38" },
} satisfies ToolExample<Input, Output>;
export const shelfmarkCutterPartTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "library-science/shelfmark-cutter-part",
      title: "Shelfmark Cutter Part Tool",
      description:
        "Extract the first uppercase letter plus one-to-six-digit Cutter-shaped token at an explicit shelfmark token boundary; no classification schedule is consulted.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { shelfmark: { type: "string", maxLength: 8192 } },
        required: ["shelfmark"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { cutter: { type: "string", maxLength: 8192 } },
        required: ["cutter"],
      },
      ports: {
        inputs: [
          {
            id: "shelfmark",
            label: "Shelfmark",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "cutter", label: "Cutter", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = shelfmarkCutterPartTool.execute;
export default shelfmarkCutterPartTool;
