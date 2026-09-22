import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletMass: number;
  readonly outletMass: number;
  readonly bypassMass: number;
};
export type Output = {
  readonly capturedMass: number;
  readonly captureFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletMass: { type: "number", exclusiveMinimum: 0 },
    outletMass: { type: "number", minimum: 0 },
    bypassMass: { type: "number", minimum: 0 },
  },
  required: ["inletMass", "outletMass", "bypassMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capturedMass: { type: "number" },
    captureFraction: { type: "number" },
  },
  required: ["capturedMass", "captureFraction"],
} as const;
/** Calculate aquaponic solids separator captured mass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inletMass, outletMass, bypassMass } = request;
  const compute = (): Output => {
    H.positive(inletMass);
    H.domain(outletMass >= 0 && bypassMass >= 0);
    return {
      capturedMass: inletMass - outletMass - bypassMass,
      captureFraction: (inletMass - outletMass - bypassMass) / inletMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inletMass: 100, outletMass: 20, bypassMass: 10 },
  output: { capturedMass: 70, captureFraction: 0.7 },
} satisfies ToolExample<Input, Output>;
export const aquaponicSolidsSeparatorCapturedMassTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaponics/aquaponic-solids-separator-captured-mass-term",
      title: "Aquaponic Solids Separator Captured Mass Term Tool",
      description:
        "Calculate aquaponic solids separator captured mass term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inletMass: { type: "number", exclusiveMinimum: 0 },
          outletMass: { type: "number", minimum: 0 },
          bypassMass: { type: "number", minimum: 0 },
        },
        required: ["inletMass", "outletMass", "bypassMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capturedMass: { type: "number" },
          captureFraction: { type: "number" },
        },
        required: ["capturedMass", "captureFraction"],
      },
      ports: {
        inputs: [
          {
            id: "inletMass",
            label: "Inlet Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outletMass",
            label: "Outlet Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bypassMass",
            label: "Bypass Mass",
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
            id: "captureFraction",
            label: "Capture Fraction",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaponicSolidsSeparatorCapturedMassTermTool.execute;
export default aquaponicSolidsSeparatorCapturedMassTermTool;
