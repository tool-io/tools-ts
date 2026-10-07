import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly computedS2: number;
  readonly targetSpin: number;
};
export type Output = {
  readonly targetS2: number;
  readonly contamination: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    computedS2: { type: "number", minimum: 0 },
    targetSpin: { type: "number", minimum: 0 },
  },
  required: ["computedS2", "targetSpin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetS2: { type: "number" },
    contamination: { type: "number" },
  },
  required: ["targetS2", "contamination"],
} as const;
/** Subtract target S(S+1) from a supplied expectation of spin squared expressed in hbar-squared units for an explicit integer or half-integer spin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { computedS2, targetSpin } = request;
  const compute = (): Output => {
    H.domain(computedS2 >= 0, "computedS2");
    H.domain(targetSpin >= 0 && Number.isInteger(targetSpin * 2), "targetSpin");
    return {
      targetS2: targetSpin * (targetSpin + 1),
      contamination: computedS2 - targetSpin * (targetSpin + 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { computedS2: 1, targetSpin: 0.5 },
  output: { targetS2: 0.75, contamination: 0.25 },
} satisfies ToolExample<Input, Output>;
export const electronicStructureSpinContaminationGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "computational-chemistry",
          "computational chemistry",
          "chemistry",
        ],
        keywords: ["computational chemistry", "chemistry"],
      },
      id: "computational-chemistry/electronic-structure-spin-contamination-gap",
      title: "Electronic Structure Spin Contamination Gap",
      description:
        "Subtract target S(S+1) from a supplied expectation of spin squared expressed in hbar-squared units for an explicit integer or half-integer spin.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          computedS2: { type: "number", minimum: 0 },
          targetSpin: { type: "number", minimum: 0 },
        },
        required: ["computedS2", "targetSpin"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetS2: { type: "number" },
          contamination: { type: "number" },
        },
        required: ["targetS2", "contamination"],
      },
      ports: {
        inputs: [
          {
            id: "computedS2",
            label: "Computed S2",
            required: true,
            valueType: { type: "number", unit: "ħ²" },
          },
          {
            id: "targetSpin",
            label: "Target Spin",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "targetS2",
            label: "Target S2",
            valueType: { type: "number", unit: "ħ²" },
          },
          {
            id: "contamination",
            label: "Contamination",
            valueType: { type: "number", unit: "ħ²" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electronicStructureSpinContaminationGapTool.execute;
export default electronicStructureSpinContaminationGapTool;
