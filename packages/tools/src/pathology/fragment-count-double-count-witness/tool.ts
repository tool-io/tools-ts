import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fragmentIds: readonly string[] };
export type Output = {
  readonly uniqueCount: number;
  readonly duplicatePositions: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fragmentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["fragmentIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueCount: { type: "integer" },
    duplicatePositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["uniqueCount", "duplicatePositions"],
} as const;
/** Identify exact duplicate fragment identifiers while retaining their positions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fragmentIds } = request;
  const compute = (): Output => {
    const seen = new Set<string>(),
      duplicatePositions: number[] = [];
    fragmentIds.forEach((x, i) => {
      if (seen.has(x)) duplicatePositions.push(i);
      seen.add(x);
    });
    return { uniqueCount: seen.size, duplicatePositions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fragmentIds: ["F1", "F2", "F1"] },
  output: { uniqueCount: 2, duplicatePositions: [2] },
} satisfies ToolExample<Input, Output>;
export const fragmentCountDoubleCountWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/fragment-count-double-count-witness",
    title: "Fragment Count Double Count Witness Tool",
    description:
      "Identify exact duplicate fragment identifiers while retaining their positions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fragmentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["fragmentIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueCount: { type: "integer" },
        duplicatePositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["uniqueCount", "duplicatePositions"],
    },
    ports: {
      inputs: [
        {
          id: "fragmentIds",
          label: "Fragment Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "uniqueCount",
          label: "Unique Count",
          valueType: { type: "integer" },
        },
        {
          id: "duplicatePositions",
          label: "Duplicate Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = fragmentCountDoubleCountWitnessTool.execute;
export default fragmentCountDoubleCountWitnessTool;
