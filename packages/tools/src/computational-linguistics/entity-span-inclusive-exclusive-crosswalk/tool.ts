import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startIndex: number;
  readonly endIndexInclusive: number;
};
export type Output = {
  readonly endIndexExclusive: number;
  readonly tokenCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startIndex: { type: "integer", minimum: 0 },
    endIndexInclusive: { type: "integer" },
  },
  required: ["startIndex", "endIndexInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endIndexExclusive: { type: "integer" },
    tokenCount: { type: "integer" },
  },
  required: ["endIndexExclusive", "tokenCount"],
} as const;
/** Convert an explicit nonempty inclusive entity-token span into an exclusive endpoint and length without retokenizing text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startIndex, endIndexInclusive } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startIndex) &&
        startIndex >= 0 &&
        startIndex <= Number.MAX_SAFE_INTEGER,
      "startIndex",
    ),
      startIndex);
    (H.domain(
      Number.isSafeInteger(endIndexInclusive) &&
        endIndexInclusive >= startIndex &&
        endIndexInclusive <= Number.MAX_SAFE_INTEGER - 1,
      "endIndexInclusive",
    ),
      endIndexInclusive);
    return {
      endIndexExclusive: endIndexInclusive + 1,
      tokenCount: endIndexInclusive - startIndex + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startIndex: 3, endIndexInclusive: 5 },
  output: { endIndexExclusive: 6, tokenCount: 3 },
} satisfies ToolExample<Input, Output>;
export const entitySpanInclusiveExclusiveCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "computational-linguistics",
          "computational linguistics",
          "information and language sciences",
        ],
        keywords: [
          "computational linguistics",
          "information and language sciences",
        ],
      },
      id: "computational-linguistics/entity-span-inclusive-exclusive-crosswalk",
      title: "Entity Span Inclusive Exclusive Crosswalk",
      description:
        "Convert an explicit nonempty inclusive entity-token span into an exclusive endpoint and length without retokenizing text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          startIndex: { type: "integer", minimum: 0 },
          endIndexInclusive: { type: "integer" },
        },
        required: ["startIndex", "endIndexInclusive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          endIndexExclusive: { type: "integer" },
          tokenCount: { type: "integer" },
        },
        required: ["endIndexExclusive", "tokenCount"],
      },
      ports: {
        inputs: [
          {
            id: "startIndex",
            label: "Start Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "endIndexInclusive",
            label: "End Index Inclusive",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "endIndexExclusive",
            label: "End Index Exclusive",
            valueType: { type: "integer" },
          },
          {
            id: "tokenCount",
            label: "Token Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = entitySpanInclusiveExclusiveCrosswalkTool.execute;
export default entitySpanInclusiveExclusiveCrosswalkTool;
