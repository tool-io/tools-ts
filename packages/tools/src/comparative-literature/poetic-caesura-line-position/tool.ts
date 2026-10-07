import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineText: string;
  readonly boundaryCodePoints: number;
};
export type Output = { readonly before: string; readonly after: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineText: { type: "string", maxLength: 8192 },
    boundaryCodePoints: { type: "integer", minimum: 0 },
  },
  required: ["lineText", "boundaryCodePoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "string", maxLength: 8192 },
    after: { type: "string", maxLength: 8192 },
  },
  required: ["before", "after"],
} as const;
/** Split one supplied verse line at an explicit zero-based Unicode code-point boundary without detecting a caesura. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineText, boundaryCodePoints } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(boundaryCodePoints) &&
        boundaryCodePoints >= 0 &&
        boundaryCodePoints <= Array.from(lineText).length,
      "boundaryCodePoints",
    ),
      boundaryCodePoints);
    return {
      before: Array.from(lineText).slice(0, boundaryCodePoints).join(""),
      after: Array.from(lineText).slice(boundaryCodePoints).join(""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineText: "Sing | muse", boundaryCodePoints: 5 },
  output: { before: "Sing ", after: "| muse" },
} satisfies ToolExample<Input, Output>;
export const poeticCaesuraLinePositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/poetic-caesura-line-position",
    title: "Poetic Caesura Line Position",
    description:
      "Split one supplied verse line at an explicit zero-based Unicode code-point boundary without detecting a caesura.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineText: { type: "string", maxLength: 8192 },
        boundaryCodePoints: { type: "integer", minimum: 0 },
      },
      required: ["lineText", "boundaryCodePoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "string", maxLength: 8192 },
        after: { type: "string", maxLength: 8192 },
      },
      required: ["before", "after"],
    },
    ports: {
      inputs: [
        {
          id: "lineText",
          label: "Line Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "boundaryCodePoints",
          label: "Boundary Code Points",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "before", label: "Before", valueType: { type: "string" } },
        { id: "after", label: "After", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = poeticCaesuraLinePositionTool.execute;
export default poeticCaesuraLinePositionTool;
