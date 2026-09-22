import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly suppliedSeparator: string;
};
export type Output = {
  readonly parts: readonly string[];
  readonly boundaryOffsets: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    suppliedSeparator: { type: "string", maxLength: 8192 },
  },
  required: ["name", "suppliedSeparator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    boundaryOffsets: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["parts", "boundaryOffsets"],
} as const;
/** Split a supplied romanized name under an explicit separator convention, preserving empty components and UTF-16 offsets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, suppliedSeparator } = request;
  const compute = (): Output => {
    H.domain(suppliedSeparator.length > 0);
    const parts = name.split(suppliedSeparator),
      boundaryOffsets: number[] = [];
    let at = 0;
    parts.slice(0, -1).forEach((x) => {
      at += x.length;
      boundaryOffsets.push(at);
      at += suppliedSeparator.length;
    });
    return { parts, boundaryOffsets };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "An-na-li", suppliedSeparator: "-" },
  output: { parts: ["An", "na", "li"], boundaryOffsets: [2, 5] },
} satisfies ToolExample<Input, Output>;
export const romanizedNameSyllableBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/romanized-name-syllable-boundary",
    title: "Romanized Name Syllable Boundary Tool",
    description:
      "Split a supplied romanized name under an explicit separator convention, preserving empty components and UTF-16 offsets.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        suppliedSeparator: { type: "string", maxLength: 8192 },
      },
      required: ["name", "suppliedSeparator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        boundaryOffsets: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["parts", "boundaryOffsets"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSeparator",
          label: "Supplied Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "parts",
          label: "Parts",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "boundaryOffsets",
          label: "Boundary Offsets",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = romanizedNameSyllableBoundaryTool.execute;
export default romanizedNameSyllableBoundaryTool;
