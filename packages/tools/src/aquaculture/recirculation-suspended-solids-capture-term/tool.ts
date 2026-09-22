import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flow: number;
  readonly inletConcentration: number;
  readonly outletConcentration: number;
  readonly duration: number;
  readonly unitFactor: number;
};
export type Output = {
  readonly capturedMass: number;
  readonly removalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number", minimum: 0 },
    inletConcentration: { type: "number", exclusiveMinimum: 0 },
    outletConcentration: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "flow",
    "inletConcentration",
    "outletConcentration",
    "duration",
    "unitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capturedMass: { type: "number" },
    removalFraction: { type: "number" },
  },
  required: ["capturedMass", "removalFraction"],
} as const;
/** Signed mass removal allows an outlet concentration above inlet to expose net solids addition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    flow,
    inletConcentration,
    outletConcentration,
    duration,
    unitFactor,
  } = request;
  const compute = (): Output => {
    H.domain(flow >= 0 && outletConcentration >= 0 && duration >= 0);
    H.positive(inletConcentration);
    H.positive(unitFactor);
    return {
      capturedMass:
        flow *
        (inletConcentration - outletConcentration) *
        duration *
        unitFactor,
      removalFraction:
        (inletConcentration - outletConcentration) / inletConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flow: 10,
    inletConcentration: 8,
    outletConcentration: 2,
    duration: 3,
    unitFactor: 1,
  },
  output: { capturedMass: 180, removalFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const recirculationSuspendedSolidsCaptureTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaculture/recirculation-suspended-solids-capture-term",
      title: "Recirculation Suspended Solids Capture Term Tool",
      description:
        "Signed mass removal allows an outlet concentration above inlet to expose net solids addition.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flow: { type: "number", minimum: 0 },
          inletConcentration: { type: "number", exclusiveMinimum: 0 },
          outletConcentration: { type: "number", minimum: 0 },
          duration: { type: "number", minimum: 0 },
          unitFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "flow",
          "inletConcentration",
          "outletConcentration",
          "duration",
          "unitFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capturedMass: { type: "number" },
          removalFraction: { type: "number" },
        },
        required: ["capturedMass", "removalFraction"],
      },
      ports: {
        inputs: [
          {
            id: "flow",
            label: "Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inletConcentration",
            label: "Inlet Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outletConcentration",
            label: "Outlet Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duration",
            label: "Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unitFactor",
            label: "Unit Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "capturedMass",
            label: "Captured Mass",
            valueType: { type: "number" },
          },
          {
            id: "removalFraction",
            label: "Removal Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = recirculationSuspendedSolidsCaptureTermTool.execute;
export default recirculationSuspendedSolidsCaptureTermTool;
