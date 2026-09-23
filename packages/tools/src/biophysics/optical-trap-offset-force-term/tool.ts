import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stiffness: number;
  readonly measuredPosition: number;
  readonly zeroPosition: number;
  readonly suppliedForceSign: number;
};
export type Output = { readonly displacement: number; readonly force: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stiffness: { type: "number", minimum: 0 },
    measuredPosition: { type: "number" },
    zeroPosition: { type: "number" },
    suppliedForceSign: { type: "integer" },
  },
  required: [
    "stiffness",
    "measuredPosition",
    "zeroPosition",
    "suppliedForceSign",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displacement: { type: "number" }, force: { type: "number" } },
  required: ["displacement", "force"],
} as const;
/** Linear calibrated bench force with an explicit restoring/applied-force sign; no calibration is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stiffness, measuredPosition, zeroPosition, suppliedForceSign } =
    request;
  const compute = (): Output => {
    H.domain(stiffness >= 0 && [1, -1].includes(suppliedForceSign));
    return {
      displacement: measuredPosition - zeroPosition,
      force: suppliedForceSign * stiffness * (measuredPosition - zeroPosition),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stiffness: 2,
    measuredPosition: 3,
    zeroPosition: 1,
    suppliedForceSign: -1,
  },
  output: { displacement: 2, force: -4 },
} satisfies ToolExample<Input, Output>;
export const opticalTrapOffsetForceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/optical-trap-offset-force-term",
    title: "Optical Trap Offset Force Term Tool",
    description:
      "Linear calibrated bench force with an explicit restoring/applied-force sign; no calibration is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stiffness: { type: "number", minimum: 0 },
        measuredPosition: { type: "number" },
        zeroPosition: { type: "number" },
        suppliedForceSign: { type: "integer" },
      },
      required: [
        "stiffness",
        "measuredPosition",
        "zeroPosition",
        "suppliedForceSign",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displacement: { type: "number" },
        force: { type: "number" },
      },
      required: ["displacement", "force"],
    },
    ports: {
      inputs: [
        {
          id: "stiffness",
          label: "Stiffness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredPosition",
          label: "Measured Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroPosition",
          label: "Zero Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedForceSign",
          label: "Supplied Force Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "displacement",
          label: "Displacement",
          valueType: { type: "number" },
        },
        { id: "force", label: "Force", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = opticalTrapOffsetForceTermTool.execute;
export default opticalTrapOffsetForceTermTool;
