import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedPerson: string;
  readonly expectedTense: string;
  readonly markedPersons: readonly string[];
  readonly markedTenses: readonly string[];
  readonly exempt: readonly boolean[];
};
export type Output = { readonly conflictIndexes: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedPerson: { type: "string", maxLength: 8192 },
    expectedTense: { type: "string", maxLength: 8192 },
    markedPersons: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    markedTenses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    exempt: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "expectedPerson",
    "expectedTense",
    "markedPersons",
    "markedTenses",
    "exempt",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conflictIndexes: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["conflictIndexes"],
} as const;
/** Audit explicitly annotated person/tense tokens with per-token exemptions; this does not perform natural-language parsing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedPerson, expectedTense, markedPersons, markedTenses, exempt } =
    request;
  const compute = (): Output => {
    H.sameLength(markedPersons, markedTenses);
    H.sameLength(markedPersons, exempt);
    return {
      conflictIndexes: markedPersons.flatMap((p, i) =>
        !exempt[i] &&
        (p !== expectedPerson || markedTenses[i] !== expectedTense)
          ? [i]
          : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expectedPerson: "third",
    expectedTense: "past",
    markedPersons: ["third", "first"],
    markedTenses: ["past", "past"],
    exempt: [false, false],
  },
  output: { conflictIndexes: [1] },
} satisfies ToolExample<Input, Output>;
export const viewpointTenseMarkedTokenConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/viewpoint-tense-marked-token-conflict",
    title: "Viewpoint Tense Marked Token Conflict Tool",
    description:
      "Audit explicitly annotated person/tense tokens with per-token exemptions; this does not perform natural-language parsing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedPerson: { type: "string", maxLength: 8192 },
        expectedTense: { type: "string", maxLength: 8192 },
        markedPersons: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        markedTenses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exempt: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: [
        "expectedPerson",
        "expectedTense",
        "markedPersons",
        "markedTenses",
        "exempt",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conflictIndexes: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["conflictIndexes"],
    },
    ports: {
      inputs: [
        {
          id: "expectedPerson",
          label: "Expected Person",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedTense",
          label: "Expected Tense",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "markedPersons",
          label: "Marked Persons",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "markedTenses",
          label: "Marked Tenses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "exempt",
          label: "Exempt",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "conflictIndexes",
          label: "Conflict Indexes",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = viewpointTenseMarkedTokenConflictTool.execute;
export default viewpointTenseMarkedTokenConflictTool;
