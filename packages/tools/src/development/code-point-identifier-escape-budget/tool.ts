import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly codePoints: readonly number[];
  readonly useBracedEscape: boolean;
};
export type Output = {
  readonly characters: number;
  readonly totalEscapeCharacters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codePoints: { type: "array", maxItems: 256, items: { type: "integer" } },
    useBracedEscape: { type: "boolean" },
  },
  required: ["codePoints", "useBracedEscape"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characters: { type: "integer" },
    totalEscapeCharacters: { type: "integer" },
  },
  required: ["characters", "totalEscapeCharacters"],
} as const;
/** Count ASCII characters needed for supplied scalar Unicode escapes, using braced code points or UTF-16 surrogate escape pairs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { codePoints, useBracedEscape } = request;
  const compute = (): Output => {
    codePoints.forEach(H.codePoint);
    return {
      characters: codePoints.length,
      totalEscapeCharacters: codePoints.reduce(
        (a, p) =>
          a +
          (useBracedEscape ? p.toString(16).length + 4 : p <= 65535 ? 6 : 12),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { codePoints: [65, 128640], useBracedEscape: true },
  output: { characters: 2, totalEscapeCharacters: 15 },
} satisfies ToolExample<Input, Output>;
export const codePointIdentifierEscapeBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/code-point-identifier-escape-budget",
    title: "Code Point Identifier Escape Budget Tool",
    description:
      "Count ASCII characters needed for supplied scalar Unicode escapes, using braced code points or UTF-16 surrogate escape pairs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codePoints: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        useBracedEscape: { type: "boolean" },
      },
      required: ["codePoints", "useBracedEscape"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characters: { type: "integer" },
        totalEscapeCharacters: { type: "integer" },
      },
      required: ["characters", "totalEscapeCharacters"],
    },
    ports: {
      inputs: [
        {
          id: "codePoints",
          label: "Code Points",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "useBracedEscape",
          label: "Use Braced Escape",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "characters",
          label: "Characters",
          valueType: { type: "integer" },
        },
        {
          id: "totalEscapeCharacters",
          label: "Total Escape Characters",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = codePointIdentifierEscapeBudgetTool.execute;
export default codePointIdentifierEscapeBudgetTool;
