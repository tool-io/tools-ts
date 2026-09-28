import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly longitudeDegrees: number;
  readonly startDegrees: number;
  readonly endDegrees: number;
  readonly includeStart: boolean;
  readonly includeEnd: boolean;
};
export type Output = {
  readonly inside: boolean;
  readonly crossesDateline: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longitudeDegrees: { type: "number" },
    startDegrees: { type: "number" },
    endDegrees: { type: "number" },
    includeStart: { type: "boolean" },
    includeEnd: { type: "boolean" },
  },
  required: [
    "longitudeDegrees",
    "startDegrees",
    "endDegrees",
    "includeStart",
    "includeEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inside: { type: "boolean" },
    crossesDateline: { type: "boolean" },
  },
  required: ["inside", "crossesDateline"],
} as const;
/** Test a supplied eastward longitude sector; equal normalized endpoints denote a single meridian, not a full globe. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    longitudeDegrees,
    startDegrees,
    endDegrees,
    includeStart,
    includeEnd,
  } = request;
  const compute = (): Output => {
    H.domain(
      [longitudeDegrees, startDegrees, endDegrees].every(
        (x) => x >= -180 && x <= 180,
      ),
    );
    const norm = (x: number) => (x === 180 ? -180 : x),
      l = norm(longitudeDegrees),
      s = norm(startDegrees),
      e = norm(endDegrees),
      crossesDateline = s > e,
      left = includeStart ? l >= s : l > s,
      right = includeEnd ? l <= e : l < e;
    return {
      inside:
        s === e
          ? includeStart && includeEnd && l === s
          : crossesDateline
            ? left || right
            : left && right,
      crossesDateline,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    longitudeDegrees: 175,
    startDegrees: 170,
    endDegrees: -170,
    includeStart: true,
    includeEnd: false,
  },
  output: { inside: true, crossesDateline: true },
} satisfies ToolExample<Input, Output>;
export const longitudeSectorMembershipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/longitude-sector-membership",
    title: "Longitude Sector Membership Tool",
    description:
      "Test a supplied eastward longitude sector; equal normalized endpoints denote a single meridian, not a full globe.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longitudeDegrees: { type: "number" },
        startDegrees: { type: "number" },
        endDegrees: { type: "number" },
        includeStart: { type: "boolean" },
        includeEnd: { type: "boolean" },
      },
      required: [
        "longitudeDegrees",
        "startDegrees",
        "endDegrees",
        "includeStart",
        "includeEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inside: { type: "boolean" },
        crossesDateline: { type: "boolean" },
      },
      required: ["inside", "crossesDateline"],
    },
    ports: {
      inputs: [
        {
          id: "longitudeDegrees",
          label: "Longitude Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startDegrees",
          label: "Start Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endDegrees",
          label: "End Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeStart",
          label: "Include Start",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        {
          id: "crossesDateline",
          label: "Crosses Dateline",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = longitudeSectorMembershipTool.execute;
export default longitudeSectorMembershipTool;
