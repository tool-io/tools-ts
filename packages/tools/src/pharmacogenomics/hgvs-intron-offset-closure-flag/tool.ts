import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offsetToken: string;
  readonly basePosition: number;
  readonly lowerOffset: number;
  readonly upperOffset: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = {
  readonly offset: number;
  readonly withinBounds: boolean;
  readonly basePosition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetToken: { type: "string", maxLength: 8192 },
    basePosition: { type: "integer" },
    lowerOffset: { type: "integer" },
    upperOffset: { type: "integer" },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: [
    "offsetToken",
    "basePosition",
    "lowerOffset",
    "upperOffset",
    "includeLower",
    "includeUpper",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "integer" },
    withinBounds: { type: "boolean" },
    basePosition: { type: "integer" },
  },
  required: ["offset", "withinBounds", "basePosition"],
} as const;
/** Inspect one explicitly signed nonzero intronic offset fragment; not a full HGVS expression or variant validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    offsetToken,
    basePosition,
    lowerOffset,
    upperOffset,
    includeLower,
    includeUpper,
  } = request;
  const compute = (): Output => {
    H.domain(/^[+-][1-9]\d*(?![\s\S])/.test(offsetToken), "offsetToken");
    const offset = Number(offsetToken);
    H.integer(offset, -Number.MAX_SAFE_INTEGER);
    H.domain(lowerOffset <= upperOffset);
    return {
      offset,
      withinBounds:
        (includeLower ? offset >= lowerOffset : offset > lowerOffset) &&
        (includeUpper ? offset <= upperOffset : offset < upperOffset),
      basePosition,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    offsetToken: "+3",
    basePosition: 20,
    lowerOffset: 1,
    upperOffset: 3,
    includeLower: true,
    includeUpper: false,
  },
  output: { offset: 3, withinBounds: false, basePosition: 20 },
} satisfies ToolExample<Input, Output>;
export const hgvsIntronOffsetClosureFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/hgvs-intron-offset-closure-flag",
    title: "Hgvs Intron Offset Closure Flag Tool",
    description:
      "Inspect one explicitly signed nonzero intronic offset fragment; not a full HGVS expression or variant validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetToken: { type: "string", maxLength: 8192 },
        basePosition: { type: "integer" },
        lowerOffset: { type: "integer" },
        upperOffset: { type: "integer" },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: [
        "offsetToken",
        "basePosition",
        "lowerOffset",
        "upperOffset",
        "includeLower",
        "includeUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "integer" },
        withinBounds: { type: "boolean" },
        basePosition: { type: "integer" },
      },
      required: ["offset", "withinBounds", "basePosition"],
    },
    ports: {
      inputs: [
        {
          id: "offsetToken",
          label: "Offset Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "basePosition",
          label: "Base Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lowerOffset",
          label: "Lower Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "upperOffset",
          label: "Upper Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeLower",
          label: "Include Lower",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
        {
          id: "withinBounds",
          label: "Within Bounds",
          valueType: { type: "boolean" },
        },
        {
          id: "basePosition",
          label: "Base Position",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hgvsIntronOffsetClosureFlagTool.execute;
export default hgvsIntronOffsetClosureFlagTool;
