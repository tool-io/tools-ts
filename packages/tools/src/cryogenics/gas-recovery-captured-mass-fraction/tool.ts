import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capturedMass: number;
  readonly releasedMass: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capturedMass: { type: "number", minimum: 0 },
    releasedMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["capturedMass", "releasedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate explicitly measured captured-to-released gas mass fraction and unrecovered remainder on a shared basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capturedMass, releasedMass } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(releasedMass) && releasedMass > 0,
      "releasedMass",
    ),
      releasedMass);
    H.domain(capturedMass >= 0 && capturedMass <= releasedMass, "capturedMass");
    return {
      fraction: capturedMass / releasedMass,
      remainder: releasedMass - capturedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capturedMass: 30, releasedMass: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const gasRecoveryCapturedMassFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/gas-recovery-captured-mass-fraction",
    title: "Gas Recovery Captured Mass Fraction",
    description:
      "Calculate explicitly measured captured-to-released gas mass fraction and unrecovered remainder on a shared basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capturedMass: { type: "number", minimum: 0 },
        releasedMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["capturedMass", "releasedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "capturedMass",
          label: "Captured Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "releasedMass",
          label: "Released Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gasRecoveryCapturedMassFractionTool.execute;
export default gasRecoveryCapturedMassFractionTool;
