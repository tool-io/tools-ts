import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseRadius: number;
  readonly rollOffset: number;
  readonly sweepRadians: number;
};
export type Output = {
  readonly baseLength: number;
  readonly offsetLength: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseRadius: { type: "number", exclusiveMinimum: 0 },
    rollOffset: { type: "number" },
    sweepRadians: { type: "number", minimum: 0 },
  },
  required: ["baseRadius", "rollOffset", "sweepRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseLength: { type: "number" },
    offsetLength: { type: "number" },
    difference: { type: "number" },
  },
  required: ["baseLength", "offsetLength", "difference"],
} as const;
/** Model parallel circular roll lines at a caller-supplied radius and sweep. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseRadius, rollOffset, sweepRadians } = request;
  const compute = (): Output => {
    H.positive(baseRadius);
    H.domain(baseRadius + rollOffset > 0 && sweepRadians >= 0);
    return {
      baseLength: baseRadius * sweepRadians,
      offsetLength: (baseRadius + rollOffset) * sweepRadians,
      difference: rollOffset * sweepRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseRadius: 10, rollOffset: 1, sweepRadians: 2 },
  output: { baseLength: 20, offsetLength: 22, difference: 2 },
} satisfies ToolExample<Input, Output>;
export const collarRollLineOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/collar-roll-line-offset-term",
    title: "Collar Roll Line Offset Term Tool",
    description:
      "Model parallel circular roll lines at a caller-supplied radius and sweep.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseRadius: { type: "number", exclusiveMinimum: 0 },
        rollOffset: { type: "number" },
        sweepRadians: { type: "number", minimum: 0 },
      },
      required: ["baseRadius", "rollOffset", "sweepRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseLength: { type: "number" },
        offsetLength: { type: "number" },
        difference: { type: "number" },
      },
      required: ["baseLength", "offsetLength", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "baseRadius",
          label: "Base Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rollOffset",
          label: "Roll Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sweepRadians",
          label: "Sweep Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baseLength",
          label: "Base Length",
          valueType: { type: "number" },
        },
        {
          id: "offsetLength",
          label: "Offset Length",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = collarRollLineOffsetTermTool.execute;
export default collarRollLineOffsetTermTool;
