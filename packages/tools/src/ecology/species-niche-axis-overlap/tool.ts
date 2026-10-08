import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLower: number;
  readonly firstUpper: number;
  readonly secondLower: number;
  readonly secondUpper: number;
};
export type Output = {
  readonly overlapWidth: number;
  readonly unionSpan: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLower: { type: "number" },
    firstUpper: { type: "number" },
    secondLower: { type: "number" },
    secondUpper: { type: "number" },
  },
  required: ["firstLower", "firstUpper", "secondLower", "secondUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapWidth: { type: "number" },
    unionSpan: { type: "number" },
  },
  required: ["overlapWidth", "unionSpan"],
} as const;
/** Intersect two explicit closed niche-axis ranges and report their enclosing span without modeling a multidimensional niche. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLower, firstUpper, secondLower, secondUpper } = request;
  const compute = (): Output => {
    H.domain(
      firstUpper >= firstLower && secondUpper >= secondLower,
      "firstUpper",
    );
    return {
      overlapWidth: Math.max(
        0,
        Math.min(firstUpper, secondUpper) - Math.max(firstLower, secondLower),
      ),
      unionSpan:
        Math.max(firstUpper, secondUpper) - Math.min(firstLower, secondLower),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLower: 0, firstUpper: 5, secondLower: 3, secondUpper: 8 },
  output: { overlapWidth: 2, unionSpan: 8 },
} satisfies ToolExample<Input, Output>;
export const speciesNicheAxisOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ecology", "biology"],
      keywords: ["ecology", "biology"],
    },
    id: "ecology/species-niche-axis-overlap",
    title: "Species Niche Axis Overlap",
    description:
      "Intersect two explicit closed niche-axis ranges and report their enclosing span without modeling a multidimensional niche.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLower: { type: "number" },
        firstUpper: { type: "number" },
        secondLower: { type: "number" },
        secondUpper: { type: "number" },
      },
      required: ["firstLower", "firstUpper", "secondLower", "secondUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapWidth: { type: "number" },
        unionSpan: { type: "number" },
      },
      required: ["overlapWidth", "unionSpan"],
    },
    ports: {
      inputs: [
        {
          id: "firstLower",
          label: "First Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstUpper",
          label: "First Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLower",
          label: "Second Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondUpper",
          label: "Second Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapWidth",
          label: "Overlap Width",
          valueType: { type: "number" },
        },
        { id: "unionSpan", label: "Union Span", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = speciesNicheAxisOverlapTool.execute;
export default speciesNicheAxisOverlapTool;
