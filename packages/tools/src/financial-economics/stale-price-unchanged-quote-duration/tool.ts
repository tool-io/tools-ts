import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastChangedTimestamp: number;
  readonly asOfTimestamp: number;
  readonly quoteUnchanged: boolean;
};
export type Output = {
  readonly unchangedDuration: number;
  readonly measured: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastChangedTimestamp: { type: "number" },
    asOfTimestamp: { type: "number" },
    quoteUnchanged: { type: "boolean" },
  },
  required: ["lastChangedTimestamp", "asOfTimestamp", "quoteUnchanged"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unchangedDuration: { type: "number" },
    measured: { type: "boolean" },
  },
  required: ["unchangedDuration", "measured"],
} as const;
/** Measure an explicitly flagged unchanged quote interval without deciding whether the quote is stale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastChangedTimestamp, asOfTimestamp, quoteUnchanged } = request;
  const compute = (): Output => {
    H.domain(asOfTimestamp >= lastChangedTimestamp, "asOfTimestamp");
    return {
      unchangedDuration: quoteUnchanged
        ? asOfTimestamp - lastChangedTimestamp
        : 0,
      measured: quoteUnchanged,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lastChangedTimestamp: 100,
    asOfTimestamp: 145,
    quoteUnchanged: true,
  },
  output: { unchangedDuration: 45, measured: true },
} satisfies ToolExample<Input, Output>;
export const stalepriceUnchangedquoteDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["financial-economics", "financial economics", "economics"],
      keywords: ["financial economics", "economics"],
    },
    id: "financial-economics/stale-price-unchanged-quote-duration",
    title: "Stale Price Unchanged Quote Duration",
    description:
      "Measure an explicitly flagged unchanged quote interval without deciding whether the quote is stale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastChangedTimestamp: { type: "number" },
        asOfTimestamp: { type: "number" },
        quoteUnchanged: { type: "boolean" },
      },
      required: ["lastChangedTimestamp", "asOfTimestamp", "quoteUnchanged"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unchangedDuration: { type: "number" },
        measured: { type: "boolean" },
      },
      required: ["unchangedDuration", "measured"],
    },
    ports: {
      inputs: [
        {
          id: "lastChangedTimestamp",
          label: "Last Changed Timestamp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "asOfTimestamp",
          label: "As Of Timestamp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quoteUnchanged",
          label: "Quote Unchanged",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "unchangedDuration",
          label: "Unchanged Duration",
          valueType: { type: "number" },
        },
        { id: "measured", label: "Measured", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stalepriceUnchangedquoteDurationTool.execute;
export default stalepriceUnchangedquoteDurationTool;
