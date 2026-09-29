import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly childEvents: number;
  readonly parentEvents: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    childEvents: { type: "integer", minimum: 0 },
    parentEvents: { type: "integer", minimum: 0 },
  },
  required: ["childEvents", "parentEvents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Compute one explicitly supplied nested research flow-gate share without immune classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { childEvents, parentEvents } = request;
  const compute = (): Output => {
    H.integer(parentEvents, 0);
    H.integer(childEvents, 0, parentEvents);
    return {
      share: parentEvents > 0 ? childEvents / parentEvents : 0,
      defined: parentEvents > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { childEvents: 20, parentEvents: 100 },
  output: { share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const flowGateChildParentShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/flow-gate-child-parent-share",
    title: "Flow Gate Child Parent Share Tool",
    description:
      "Compute one explicitly supplied nested research flow-gate share without immune classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        childEvents: { type: "integer", minimum: 0 },
        parentEvents: { type: "integer", minimum: 0 },
      },
      required: ["childEvents", "parentEvents"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "childEvents",
          label: "Child Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parentEvents",
          label: "Parent Events",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = flowGateChildParentShareTool.execute;
export default flowGateChildParentShareTool;
