import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousReopenCount: number;
  readonly eventIsReopen: boolean;
};
export type Output = { readonly updatedReopenCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousReopenCount: { type: "integer", minimum: 0 },
    eventIsReopen: { type: "boolean" },
  },
  required: ["previousReopenCount", "eventIsReopen"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { updatedReopenCount: { type: "integer" } },
  required: ["updatedReopenCount"],
} as const;
/** Increment an explicit action-item reopen count only when the supplied event is a reopen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousReopenCount, eventIsReopen } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousReopenCount) &&
        previousReopenCount >= 0 &&
        previousReopenCount <= Number.MAX_SAFE_INTEGER,
      "previousReopenCount",
    ),
      previousReopenCount);
    return {
      updatedReopenCount: Number(
        BigInt(previousReopenCount) + (eventIsReopen ? 1n : 0n),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousReopenCount: 3, eventIsReopen: true },
  output: { updatedReopenCount: 4 },
} satisfies ToolExample<Input, Output>;
export const actionItemReopenCountStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/action-item-reopen-count-step",
    title: "Action Item Reopen Count Step",
    description:
      "Increment an explicit action-item reopen count only when the supplied event is a reopen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousReopenCount: { type: "integer", minimum: 0 },
        eventIsReopen: { type: "boolean" },
      },
      required: ["previousReopenCount", "eventIsReopen"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { updatedReopenCount: { type: "integer" } },
      required: ["updatedReopenCount"],
    },
    ports: {
      inputs: [
        {
          id: "previousReopenCount",
          label: "Previous Reopen Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eventIsReopen",
          label: "Event Is Reopen",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "updatedReopenCount",
          label: "Updated Reopen Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = actionItemReopenCountStepTool.execute;
export default actionItemReopenCountStepTool;
