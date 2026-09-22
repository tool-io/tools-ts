import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly innerRadius: number;
  readonly turnRadians: number;
  readonly treadCount: number;
  readonly suppliedMinimum: number;
};
export type Output = {
  readonly innerTreadArc: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerRadius: { type: "number", minimum: 0 },
    turnRadians: { type: "number", minimum: 0 },
    treadCount: { type: "integer", minimum: 1 },
    suppliedMinimum: { type: "number", minimum: 0 },
  },
  required: ["innerRadius", "turnRadians", "treadCount", "suppliedMinimum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { innerTreadArc: { type: "number" }, margin: { type: "number" } },
  required: ["innerTreadArc", "margin"],
} as const;
/** Compare equal radial winder arc widths with an explicit supplied minimum, without selecting a code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { innerRadius, turnRadians, treadCount, suppliedMinimum } = request;
  const compute = (): Output => {
    H.domain(innerRadius >= 0 && turnRadians >= 0 && suppliedMinimum >= 0);
    H.integer(treadCount, 1);
    return {
      innerTreadArc: innerRadius * (turnRadians / treadCount),
      margin: innerRadius * (turnRadians / treadCount) - suppliedMinimum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    innerRadius: 1,
    turnRadians: 1.2,
    treadCount: 3,
    suppliedMinimum: 0.3,
  },
  output: { innerTreadArc: 0.39999999999999997, margin: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const stairWinderInnerTreadGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/stair-winder-inner-tread-gap",
    title: "Stair Winder Inner Tread Gap Tool",
    description:
      "Compare equal radial winder arc widths with an explicit supplied minimum, without selecting a code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerRadius: { type: "number", minimum: 0 },
        turnRadians: { type: "number", minimum: 0 },
        treadCount: { type: "integer", minimum: 1 },
        suppliedMinimum: { type: "number", minimum: 0 },
      },
      required: ["innerRadius", "turnRadians", "treadCount", "suppliedMinimum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerTreadArc: { type: "number" },
        margin: { type: "number" },
      },
      required: ["innerTreadArc", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "innerRadius",
          label: "Inner Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "turnRadians",
          label: "Turn Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "treadCount",
          label: "Tread Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMinimum",
          label: "Supplied Minimum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "innerTreadArc",
          label: "Inner Tread Arc",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stairWinderInnerTreadGapTool.execute;
export default stairWinderInnerTreadGapTool;
