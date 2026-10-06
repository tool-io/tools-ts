import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokenId: string;
  readonly startOffset: number;
  readonly endOffsetExclusive: number;
  readonly offsetUnit: string;
};
export type Output = { readonly label: string; readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenId: { type: "string", maxLength: 8192, minLength: 1 },
    startOffset: { type: "integer", minimum: 0 },
    endOffsetExclusive: { type: "integer" },
    offsetUnit: {
      type: "string",
      maxLength: 8192,
      enum: ["byte", "code-point", "utf16-code-unit"],
    },
  },
  required: ["tokenId", "startOffset", "endOffsetExclusive", "offsetUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    length: { type: "integer" },
  },
  required: ["label", "length"],
} as const;
/** Label an explicit half-open token offset interval and its indexing unit without converting between byte and character offsets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokenId, startOffset, endOffsetExclusive, offsetUnit } = request;
  const compute = (): Output => {
    H.domain(tokenId.length > 0, "tokenId");
    (H.domain(
      Number.isSafeInteger(startOffset) &&
        startOffset >= 0 &&
        startOffset <= Number.MAX_SAFE_INTEGER,
      "startOffset",
    ),
      startOffset);
    (H.domain(
      Number.isSafeInteger(endOffsetExclusive) &&
        endOffsetExclusive >= startOffset &&
        endOffsetExclusive <= Number.MAX_SAFE_INTEGER,
      "endOffsetExclusive",
    ),
      endOffsetExclusive);
    H.domain(
      ["byte", "code-point", "utf16-code-unit"].includes(offsetUnit),
      "offsetUnit",
    );
    return {
      label:
        tokenId +
        " [" +
        startOffset +
        "," +
        endOffsetExclusive +
        ") " +
        offsetUnit,
      length: endOffsetExclusive - startOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokenId: "T17",
    startOffset: 12,
    endOffsetExclusive: 17,
    offsetUnit: "byte",
  },
  output: { label: "T17 [12,17) byte", length: 5 },
} satisfies ToolExample<Input, Output>;
export const tokenOffsetIntervalLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/token-offset-interval-label",
    title: "Token Offset Interval Label",
    description:
      "Label an explicit half-open token offset interval and its indexing unit without converting between byte and character offsets.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenId: { type: "string", maxLength: 8192, minLength: 1 },
        startOffset: { type: "integer", minimum: 0 },
        endOffsetExclusive: { type: "integer" },
        offsetUnit: {
          type: "string",
          maxLength: 8192,
          enum: ["byte", "code-point", "utf16-code-unit"],
        },
      },
      required: ["tokenId", "startOffset", "endOffsetExclusive", "offsetUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        length: { type: "integer" },
      },
      required: ["label", "length"],
    },
    ports: {
      inputs: [
        {
          id: "tokenId",
          label: "Token Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "startOffset",
          label: "Start Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endOffsetExclusive",
          label: "End Offset Exclusive",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offsetUnit",
          label: "Offset Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "length", label: "Length", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = tokenOffsetIntervalLabelTool.execute;
export default tokenOffsetIntervalLabelTool;
