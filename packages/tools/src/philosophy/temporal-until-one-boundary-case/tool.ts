import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: readonly boolean[];
  readonly right: readonly boolean[];
};
export type Output = { readonly holds: boolean; readonly witnessIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "array", maxItems: 256, items: { type: "boolean" } },
    right: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { holds: { type: "boolean" }, witnessIndex: { type: "integer" } },
  required: ["holds", "witnessIndex"],
} as const;
/** Finite-trace strong until at index zero: right must eventually hold and left must hold strictly before its earliest qualifying witness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, right } = request;
  const compute = (): Output => {
    H.sameLength(left, right);
    const witnessIndex = right.findIndex(
      (x, i) => x && left.slice(0, i).every(Boolean),
    );
    return { holds: witnessIndex >= 0, witnessIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { left: [true, true, false], right: [false, false, true] },
  output: { holds: true, witnessIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const temporalUntilOneBoundaryCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/temporal-until-one-boundary-case",
    title: "Temporal Until One Boundary Case Tool",
    description:
      "Finite-trace strong until at index zero: right must eventually hold and left must hold strictly before its earliest qualifying witness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "array", maxItems: 256, items: { type: "boolean" } },
        right: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["left", "right"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        holds: { type: "boolean" },
        witnessIndex: { type: "integer" },
      },
      required: ["holds", "witnessIndex"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "holds", label: "Holds", valueType: { type: "boolean" } },
        {
          id: "witnessIndex",
          label: "Witness Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = temporalUntilOneBoundaryCaseTool.execute;
export default temporalUntilOneBoundaryCaseTool;
