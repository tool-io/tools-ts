import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly calibrationLower: number;
  readonly calibrationUpper: number;
  readonly verified: readonly boolean[];
  readonly lowerIncluded: boolean;
  readonly upperIncluded: boolean;
};
export type Output = {
  readonly insideRange: number;
  readonly supported: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    calibrationLower: { type: "number" },
    calibrationUpper: { type: "number" },
    verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
    lowerIncluded: { type: "boolean" },
    upperIncluded: { type: "boolean" },
  },
  required: [
    "values",
    "calibrationLower",
    "calibrationUpper",
    "verified",
    "lowerIncluded",
    "upperIncluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideRange: { type: "integer" },
    supported: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["insideRange", "supported", "share", "defined"],
} as const;
/** Account for source-verified measurements inside an explicit calibration interval; no instrument acceptance judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    values,
    calibrationLower,
    calibrationUpper,
    verified,
    lowerIncluded,
    upperIncluded,
  } = request;
  const compute = (): Output => {
    H.sameLength(values, verified);
    H.domain(calibrationUpper >= calibrationLower);
    return (() => {
      const mask = values.map(
          (x) =>
            (lowerIncluded ? x >= calibrationLower : x > calibrationLower) &&
            (upperIncluded ? x <= calibrationUpper : x < calibrationUpper),
        ),
        insideRange = mask.filter(Boolean).length,
        supported = mask.filter((x, i) => x && verified[i]).length;
      return {
        insideRange,
        supported,
        share: insideRange ? supported / insideRange : 0,
        defined: insideRange > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    values: [0, 1, 2],
    calibrationLower: 0,
    calibrationUpper: 2,
    verified: [true, false, true],
    lowerIncluded: true,
    upperIncluded: false,
  },
  output: { insideRange: 2, supported: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const calibrationRangeSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/calibration-range-support-share",
    title: "Calibration Range Support Share Tool",
    description:
      "Account for source-verified measurements inside an explicit calibration interval; no instrument acceptance judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        calibrationLower: { type: "number" },
        calibrationUpper: { type: "number" },
        verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
        lowerIncluded: { type: "boolean" },
        upperIncluded: { type: "boolean" },
      },
      required: [
        "values",
        "calibrationLower",
        "calibrationUpper",
        "verified",
        "lowerIncluded",
        "upperIncluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insideRange: { type: "integer" },
        supported: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["insideRange", "supported", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "calibrationLower",
          label: "Calibration Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "calibrationUpper",
          label: "Calibration Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verified",
          label: "Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "lowerIncluded",
          label: "Lower Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperIncluded",
          label: "Upper Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "insideRange",
          label: "Inside Range",
          valueType: { type: "integer" },
        },
        { id: "supported", label: "Supported", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = calibrationRangeSupportShareTool.execute;
export default calibrationRangeSupportShareTool;
