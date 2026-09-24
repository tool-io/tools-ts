import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingAt: number;
  readonly closingAt: number;
  readonly requestedAt: number;
};
export type Output = {
  readonly fromOpening: number;
  readonly untilClosing: number;
  readonly open: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingAt: { type: "number" },
    closingAt: { type: "number" },
    requestedAt: { type: "number" },
  },
  required: ["openingAt", "closingAt", "requestedAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fromOpening: { type: "number" },
    untilClosing: { type: "number" },
    open: { type: "boolean" },
  },
  required: ["fromOpening", "untilClosing", "open"],
} as const;
/** Compare supplied service hours as one half-open interval without a live opening-hours lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingAt, closingAt, requestedAt } = request;
  const compute = (): Output => {
    H.domain(closingAt >= openingAt);
    return {
      fromOpening: requestedAt - openingAt,
      untilClosing: closingAt - requestedAt,
      open: requestedAt >= openingAt && requestedAt < closingAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingAt: 10, closingAt: 20, requestedAt: 15 },
  output: { fromOpening: 5, untilClosing: 5, open: true },
} satisfies ToolExample<Input, Output>;
export const serviceOpeningWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/service-opening-window-gap",
    title: "Service Opening Window Gap Tool",
    description:
      "Compare supplied service hours as one half-open interval without a live opening-hours lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingAt: { type: "number" },
        closingAt: { type: "number" },
        requestedAt: { type: "number" },
      },
      required: ["openingAt", "closingAt", "requestedAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fromOpening: { type: "number" },
        untilClosing: { type: "number" },
        open: { type: "boolean" },
      },
      required: ["fromOpening", "untilClosing", "open"],
    },
    ports: {
      inputs: [
        {
          id: "openingAt",
          label: "Opening At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closingAt",
          label: "Closing At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requestedAt",
          label: "Requested At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fromOpening",
          label: "From Opening",
          valueType: { type: "number" },
        },
        {
          id: "untilClosing",
          label: "Until Closing",
          valueType: { type: "number" },
        },
        { id: "open", label: "Open", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = serviceOpeningWindowGapTool.execute;
export default serviceOpeningWindowGapTool;
