import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly overlyingYoung: number;
  readonly overlyingOld: number;
  readonly underlyingYoung: number;
  readonly underlyingOld: number;
};
export type Output = {
  readonly minimumGap: number;
  readonly maximumGap: number;
  readonly midpointGap: number;
  readonly certainlyPositive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlyingYoung: { type: "number", minimum: 0 },
    overlyingOld: { type: "number" },
    underlyingYoung: { type: "number", minimum: 0 },
    underlyingOld: { type: "number" },
  },
  required: [
    "overlyingYoung",
    "overlyingOld",
    "underlyingYoung",
    "underlyingOld",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumGap: { type: "number" },
    maximumGap: { type: "number" },
    midpointGap: { type: "number" },
    certainlyPositive: { type: "boolean" },
  },
  required: ["minimumGap", "maximumGap", "midpointGap", "certainlyPositive"],
} as const;
/** Age-bound gap envelope across an explicitly identified unconformity, without assigning missing-time ages from a stratigraphic table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { overlyingYoung, overlyingOld, underlyingYoung, underlyingOld } =
    request;
  const compute = (): Output => {
    H.domain(
      overlyingYoung >= 0 &&
        overlyingOld >= overlyingYoung &&
        underlyingYoung >= 0 &&
        underlyingOld >= underlyingYoung,
    );
    return {
      minimumGap: underlyingYoung - overlyingOld,
      maximumGap: underlyingOld - overlyingYoung,
      midpointGap:
        (underlyingYoung + underlyingOld - overlyingYoung - overlyingOld) / 2,
      certainlyPositive: underlyingYoung > overlyingOld,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    overlyingYoung: 10,
    overlyingOld: 12,
    underlyingYoung: 20,
    underlyingOld: 24,
  },
  output: {
    minimumGap: 8,
    maximumGap: 14,
    midpointGap: 11,
    certainlyPositive: true,
  },
} satisfies ToolExample<Input, Output>;
export const unconformityDurationExplicitBoundsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/unconformity-duration-explicit-bounds",
    title: "Unconformity Duration Explicit Bounds Tool",
    description:
      "Age-bound gap envelope across an explicitly identified unconformity, without assigning missing-time ages from a stratigraphic table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlyingYoung: { type: "number", minimum: 0 },
        overlyingOld: { type: "number" },
        underlyingYoung: { type: "number", minimum: 0 },
        underlyingOld: { type: "number" },
      },
      required: [
        "overlyingYoung",
        "overlyingOld",
        "underlyingYoung",
        "underlyingOld",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumGap: { type: "number" },
        maximumGap: { type: "number" },
        midpointGap: { type: "number" },
        certainlyPositive: { type: "boolean" },
      },
      required: [
        "minimumGap",
        "maximumGap",
        "midpointGap",
        "certainlyPositive",
      ],
    },
    ports: {
      inputs: [
        {
          id: "overlyingYoung",
          label: "Overlying Young",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlyingOld",
          label: "Overlying Old",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "underlyingYoung",
          label: "Underlying Young",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "underlyingOld",
          label: "Underlying Old",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumGap",
          label: "Minimum Gap",
          valueType: { type: "number" },
        },
        {
          id: "maximumGap",
          label: "Maximum Gap",
          valueType: { type: "number" },
        },
        {
          id: "midpointGap",
          label: "Midpoint Gap",
          valueType: { type: "number" },
        },
        {
          id: "certainlyPositive",
          label: "Certainly Positive",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = unconformityDurationExplicitBoundsTool.execute;
export default unconformityDurationExplicitBoundsTool;
