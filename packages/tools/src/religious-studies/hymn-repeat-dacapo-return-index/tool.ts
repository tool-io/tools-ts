import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstIndex: number;
  readonly daCapoIndex: number;
  readonly repeatedPickup: number;
  readonly includePickup: boolean;
};
export type Output = { readonly returnIndex: number; readonly span: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIndex: { type: "integer", minimum: 0 },
    daCapoIndex: { type: "integer" },
    repeatedPickup: { type: "integer", minimum: 0 },
    includePickup: { type: "boolean" },
  },
  required: ["firstIndex", "daCapoIndex", "repeatedPickup", "includePickup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { returnIndex: { type: "integer" }, span: { type: "integer" } },
  required: ["returnIndex", "span"],
} as const;
/** Index bookkeeping under a supplied repeat/pickup convention, not an interpretation of a musical edition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstIndex, daCapoIndex, repeatedPickup, includePickup } = request;
  const compute = (): Output => {
    H.integer(firstIndex, 0);
    H.integer(daCapoIndex, firstIndex);
    H.integer(repeatedPickup, 0, firstIndex);
    return {
      returnIndex: firstIndex - (includePickup ? repeatedPickup : 0),
      span: daCapoIndex - firstIndex + (includePickup ? repeatedPickup : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstIndex: 1,
    daCapoIndex: 20,
    repeatedPickup: 1,
    includePickup: true,
  },
  output: { returnIndex: 0, span: 20 },
} satisfies ToolExample<Input, Output>;
export const hymnRepeatDacapoReturnIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/hymn-repeat-dacapo-return-index",
    title: "Hymn Repeat Dacapo Return Index Tool",
    description:
      "Index bookkeeping under a supplied repeat/pickup convention, not an interpretation of a musical edition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIndex: { type: "integer", minimum: 0 },
        daCapoIndex: { type: "integer" },
        repeatedPickup: { type: "integer", minimum: 0 },
        includePickup: { type: "boolean" },
      },
      required: [
        "firstIndex",
        "daCapoIndex",
        "repeatedPickup",
        "includePickup",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnIndex: { type: "integer" },
        span: { type: "integer" },
      },
      required: ["returnIndex", "span"],
    },
    ports: {
      inputs: [
        {
          id: "firstIndex",
          label: "First Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "daCapoIndex",
          label: "Da Capo Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "repeatedPickup",
          label: "Repeated Pickup",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includePickup",
          label: "Include Pickup",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "returnIndex",
          label: "Return Index",
          valueType: { type: "integer" },
        },
        { id: "span", label: "Span", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = hymnRepeatDacapoReturnIndexTool.execute;
export default hymnRepeatDacapoReturnIndexTool;
