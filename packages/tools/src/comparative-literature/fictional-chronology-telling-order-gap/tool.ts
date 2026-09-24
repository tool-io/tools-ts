import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventIds: readonly string[];
  readonly chronology: readonly number[];
  readonly telling: readonly number[];
};
export type Output = {
  readonly displacements: readonly number[];
  readonly inversions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    chronology: { type: "array", maxItems: 256, items: { type: "integer" } },
    telling: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["eventIds", "chronology", "telling"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displacements: { type: "array", maxItems: 256, items: { type: "integer" } },
    inversions: { type: "integer" },
  },
  required: ["displacements", "inversions"],
} as const;
/** Compare unique ordinal ranks of the same named events; count order inversions separately from rank displacement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventIds, chronology, telling } = request;
  const compute = (): Output => {
    H.sameLength(eventIds, chronology);
    H.sameLength(eventIds, telling);
    H.domain(
      new Set(eventIds).size === eventIds.length &&
        new Set(chronology).size === chronology.length &&
        new Set(telling).size === telling.length,
    );
    let inversions = 0;
    for (let i = 0; i < chronology.length; i++)
      for (let j = i + 1; j < chronology.length; j++)
        if ((chronology[i] - chronology[j]) * (telling[i] - telling[j]) < 0)
          inversions++;
    return {
      displacements: telling.map((x, i) => x - chronology[i]),
      inversions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventIds: ["A", "B", "C"],
    chronology: [1, 2, 3],
    telling: [2, 1, 3],
  },
  output: { displacements: [1, -1, 0], inversions: 1 },
} satisfies ToolExample<Input, Output>;
export const fictionalChronologyTellingOrderGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/fictional-chronology-telling-order-gap",
    title: "Fictional Chronology Telling Order Gap Tool",
    description:
      "Compare unique ordinal ranks of the same named events; count order inversions separately from rank displacement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        chronology: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        telling: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["eventIds", "chronology", "telling"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displacements: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        inversions: { type: "integer" },
      },
      required: ["displacements", "inversions"],
    },
    ports: {
      inputs: [
        {
          id: "eventIds",
          label: "Event Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "chronology",
          label: "Chronology",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "telling",
          label: "Telling",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "displacements",
          label: "Displacements",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "inversions",
          label: "Inversions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = fictionalChronologyTellingOrderGapTool.execute;
export default fictionalChronologyTellingOrderGapTool;
