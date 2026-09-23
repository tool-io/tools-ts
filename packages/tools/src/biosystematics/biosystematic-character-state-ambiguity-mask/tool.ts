import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly states: readonly string[];
  readonly permitted: readonly string[];
  readonly unknownToken: string;
};
export type Output = {
  readonly known: readonly boolean[];
  readonly ambiguousIndices: readonly number[];
  readonly unknownIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    states: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    permitted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unknownToken: { type: "string", maxLength: 8192 },
  },
  required: ["states", "permitted", "unknownToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "array", maxItems: 256, items: { type: "boolean" } },
    ambiguousIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    unknownIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["known", "ambiguousIndices", "unknownIndices"],
} as const;
/** Mark exact supplied character states, explicit slash ambiguity and unknown tokens. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { states, permitted, unknownToken } = request;
  const compute = (): Output => {
    const known = states.map((x) => permitted.includes(x)),
      ambiguousIndices = states.flatMap((x, i) => (x.includes("/") ? [i] : [])),
      unknownIndices = states.flatMap((x, i) =>
        x === unknownToken ? [i] : [],
      );
    return { known, ambiguousIndices, unknownIndices };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    states: ["0", "0/1", "?", "1"],
    permitted: ["0", "1"],
    unknownToken: "?",
  },
  output: {
    known: [true, false, false, true],
    ambiguousIndices: [1],
    unknownIndices: [2],
  },
} satisfies ToolExample<Input, Output>;
export const biosystematicCharacterStateAmbiguityMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosystematics/biosystematic-character-state-ambiguity-mask",
      title: "Biosystematic Character State Ambiguity Mask Tool",
      description:
        "Mark exact supplied character states, explicit slash ambiguity and unknown tokens.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          states: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          permitted: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          unknownToken: { type: "string", maxLength: 8192 },
        },
        required: ["states", "permitted", "unknownToken"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          known: { type: "array", maxItems: 256, items: { type: "boolean" } },
          ambiguousIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          unknownIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["known", "ambiguousIndices", "unknownIndices"],
      },
      ports: {
        inputs: [
          {
            id: "states",
            label: "States",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "permitted",
            label: "Permitted",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "unknownToken",
            label: "Unknown Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "known",
            label: "Known",
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "ambiguousIndices",
            label: "Ambiguous Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "unknownIndices",
            label: "Unknown Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosystematicCharacterStateAmbiguityMaskTool.execute;
export default biosystematicCharacterStateAmbiguityMaskTool;
