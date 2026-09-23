import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletVolume: number;
  readonly outletVolume: number;
  readonly inletConcentration: number;
  readonly outletConcentration: number;
};
export type Output = {
  readonly inletMass: number;
  readonly outletMass: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletVolume: { type: "number", minimum: 0 },
    outletVolume: { type: "number", minimum: 0 },
    inletConcentration: { type: "number", minimum: 0 },
    outletConcentration: { type: "number", minimum: 0 },
  },
  required: [
    "inletVolume",
    "outletVolume",
    "inletConcentration",
    "outletConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletMass: { type: "number" },
    outletMass: { type: "number" },
    difference: { type: "number" },
  },
  required: ["inletMass", "outletMass", "difference"],
} as const;
/** Reconcile supplied stream mass observations without attributing removal mechanisms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inletVolume, outletVolume, inletConcentration, outletConcentration } =
    request;
  const compute = (): Output => {
    H.domain(
      inletVolume >= 0 &&
        outletVolume >= 0 &&
        inletConcentration >= 0 &&
        outletConcentration >= 0,
    );
    return {
      inletMass: inletVolume * inletConcentration,
      outletMass: outletVolume * outletConcentration,
      difference:
        inletVolume * inletConcentration - outletVolume * outletConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inletVolume: 100,
    outletVolume: 90,
    inletConcentration: 5,
    outletConcentration: 2,
  },
  output: { inletMass: 500, outletMass: 180, difference: 320 },
} satisfies ToolExample<Input, Output>;
export const remediationContaminantInletOutletMassTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/remediation-contaminant-inlet-outlet-mass-term",
      title: "Remediation Contaminant Inlet Outlet Mass Term Tool",
      description:
        "Reconcile supplied stream mass observations without attributing removal mechanisms.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inletVolume: { type: "number", minimum: 0 },
          outletVolume: { type: "number", minimum: 0 },
          inletConcentration: { type: "number", minimum: 0 },
          outletConcentration: { type: "number", minimum: 0 },
        },
        required: [
          "inletVolume",
          "outletVolume",
          "inletConcentration",
          "outletConcentration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inletMass: { type: "number" },
          outletMass: { type: "number" },
          difference: { type: "number" },
        },
        required: ["inletMass", "outletMass", "difference"],
      },
      ports: {
        inputs: [
          {
            id: "inletVolume",
            label: "Inlet Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outletVolume",
            label: "Outlet Volume",
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
        ],
        outputs: [
          {
            id: "inletMass",
            label: "Inlet Mass",
            valueType: { type: "number" },
          },
          {
            id: "outletMass",
            label: "Outlet Mass",
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
export const run = remediationContaminantInletOutletMassTermTool.execute;
export default remediationContaminantInletOutletMassTermTool;
