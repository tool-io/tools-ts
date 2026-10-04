import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly text: string };
export type Output = {
  readonly indices: readonly number[];
  readonly points: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indices: { type: "array", maxItems: 256, items: { type: "integer" } },
    points: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["indices", "points"],
} as const;
/** Compute zero width character position label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { text } = input;
  const compute = (): Output => {
    const indices: number[] = [],
      points: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const p = text.charCodeAt(i);
      if ([0x200b, 0x200c, 0x200d, 0x2060, 0xfeff].includes(p)) {
        indices.push(i);
        points.push(p);
      }
    }
    return { indices, points };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "a​b‍" },
  output: { indices: [1, 3], points: [8203, 8205] },
} satisfies ToolExample<Input, Output>;
export const zeroWidthCharacterPositionLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/zero-width-character-position-label",
  title: "Zero Width Character Position Label Tool",
  description:
    "Compute zero width character position label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "text",
        label: "Text",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "indices",
        label: "Indices",
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "points",
        label: "Points",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = zeroWidthCharacterPositionLabelTool.execute;
export default zeroWidthCharacterPositionLabelTool;
