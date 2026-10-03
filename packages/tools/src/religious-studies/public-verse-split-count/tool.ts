import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceVerseIds: readonly string[];
  readonly fragmentIds: readonly string[];
};
export type Output = {
  readonly sourceVerses: number;
  readonly distinctFragments: number;
  readonly additionalFragments: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceVerseIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    fragmentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["sourceVerseIds", "fragmentIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceVerses: { type: "integer" },
    distinctFragments: { type: "integer" },
    additionalFragments: { type: "integer" },
  },
  required: ["sourceVerses", "distinctFragments", "additionalFragments"],
} as const;
/** Count literal public verse-to-fragment incidences without interpreting or resegmenting sacred text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceVerseIds, fragmentIds } = request;
  const compute = (): Output => {
    H.sameLength(sourceVerseIds, fragmentIds);
    return (() => {
      const groups = new Map<string, Set<string>>();
      sourceVerseIds.forEach((id, i) => {
        const s = groups.get(id) ?? new Set<string>();
        s.add(fragmentIds[i]);
        groups.set(id, s);
      });
      const distinctFragments = [...groups.values()].reduce(
        (s, x) => s + x.size,
        0,
      );
      return {
        sourceVerses: groups.size,
        distinctFragments,
        additionalFragments: distinctFragments - groups.size,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceVerseIds: ["v1", "v1", "v2"], fragmentIds: ["a", "b", "a"] },
  output: { sourceVerses: 2, distinctFragments: 3, additionalFragments: 1 },
} satisfies ToolExample<Input, Output>;
export const publicVerseSplitCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/public-verse-split-count",
    title: "Public Verse Split Count Tool",
    description:
      "Count literal public verse-to-fragment incidences without interpreting or resegmenting sacred text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceVerseIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        fragmentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["sourceVerseIds", "fragmentIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceVerses: { type: "integer" },
        distinctFragments: { type: "integer" },
        additionalFragments: { type: "integer" },
      },
      required: ["sourceVerses", "distinctFragments", "additionalFragments"],
    },
    ports: {
      inputs: [
        {
          id: "sourceVerseIds",
          label: "Source Verse Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "fragmentIds",
          label: "Fragment Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "sourceVerses",
          label: "Source Verses",
          valueType: { type: "integer" },
        },
        {
          id: "distinctFragments",
          label: "Distinct Fragments",
          valueType: { type: "integer" },
        },
        {
          id: "additionalFragments",
          label: "Additional Fragments",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicVerseSplitCountTool.execute;
export default publicVerseSplitCountTool;
