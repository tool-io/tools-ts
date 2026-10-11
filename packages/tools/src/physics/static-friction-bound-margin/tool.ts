import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normalForceNewtons: number;
  readonly suppliedStaticCoefficient: number;
  readonly requiredFrictionMagnitudeNewtons: number;
};
export type Output = {
  readonly maximumMagnitudeNewtons: number;
  readonly marginNewtons: number;
  readonly withinSuppliedBound: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalForceNewtons: { type: "number", minimum: 0 },
    suppliedStaticCoefficient: { type: "number", minimum: 0 },
    requiredFrictionMagnitudeNewtons: { type: "number", minimum: 0 },
  },
  required: [
    "normalForceNewtons",
    "suppliedStaticCoefficient",
    "requiredFrictionMagnitudeNewtons",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumMagnitudeNewtons: { type: "number" },
    marginNewtons: { type: "number" },
    withinSuppliedBound: { type: "boolean" },
  },
  required: ["maximumMagnitudeNewtons", "marginNewtons", "withinSuppliedBound"],
} as const;
/** Compare an explicit required friction magnitude with a supplied Coulomb static-friction bound without selecting a material coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    normalForceNewtons,
    suppliedStaticCoefficient,
    requiredFrictionMagnitudeNewtons,
  } = request;
  const compute = (): Output => {
    H.domain(
      normalForceNewtons >= 0 &&
        suppliedStaticCoefficient >= 0 &&
        requiredFrictionMagnitudeNewtons >= 0,
      "normalForceNewtons",
    );
    return {
      maximumMagnitudeNewtons: normalForceNewtons * suppliedStaticCoefficient,
      marginNewtons:
        normalForceNewtons * suppliedStaticCoefficient -
        requiredFrictionMagnitudeNewtons,
      withinSuppliedBound:
        requiredFrictionMagnitudeNewtons <=
        normalForceNewtons * suppliedStaticCoefficient,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    normalForceNewtons: 100,
    suppliedStaticCoefficient: 0.4,
    requiredFrictionMagnitudeNewtons: 30,
  },
  output: {
    maximumMagnitudeNewtons: 40,
    marginNewtons: 10,
    withinSuppliedBound: true,
  },
} satisfies ToolExample<Input, Output>;
export const staticFrictionBoundMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physics"],
      keywords: ["physics"],
    },
    id: "physics/static-friction-bound-margin",
    title: "Static Friction Bound Margin",
    description:
      "Compare an explicit required friction magnitude with a supplied Coulomb static-friction bound without selecting a material coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalForceNewtons: { type: "number", minimum: 0 },
        suppliedStaticCoefficient: { type: "number", minimum: 0 },
        requiredFrictionMagnitudeNewtons: { type: "number", minimum: 0 },
      },
      required: [
        "normalForceNewtons",
        "suppliedStaticCoefficient",
        "requiredFrictionMagnitudeNewtons",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maximumMagnitudeNewtons: { type: "number" },
        marginNewtons: { type: "number" },
        withinSuppliedBound: { type: "boolean" },
      },
      required: [
        "maximumMagnitudeNewtons",
        "marginNewtons",
        "withinSuppliedBound",
      ],
    },
    ports: {
      inputs: [
        {
          id: "normalForceNewtons",
          label: "Normal Force Newtons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedStaticCoefficient",
          label: "Supplied Static Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredFrictionMagnitudeNewtons",
          label: "Required Friction Magnitude Newtons",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "maximumMagnitudeNewtons",
          label: "Maximum Magnitude Newtons",
          valueType: { type: "number" },
        },
        {
          id: "marginNewtons",
          label: "Margin Newtons",
          valueType: { type: "number" },
        },
        {
          id: "withinSuppliedBound",
          label: "Within Supplied Bound",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = staticFrictionBoundMarginTool.execute;
export default staticFrictionBoundMarginTool;
