import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enthalpy: number;
  readonly oldReferenceTemperature: number;
  readonly newReferenceTemperature: number;
  readonly heatCapacity: number;
  readonly massFlow: number;
};
export type Output = {
  readonly shiftedSpecificEnthalpy: number;
  readonly enthalpyFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enthalpy: { type: "number" },
    oldReferenceTemperature: { type: "number" },
    newReferenceTemperature: { type: "number" },
    heatCapacity: { type: "number", minimum: 0 },
    massFlow: { type: "number", minimum: 0 },
  },
  required: [
    "enthalpy",
    "oldReferenceTemperature",
    "newReferenceTemperature",
    "heatCapacity",
    "massFlow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedSpecificEnthalpy: { type: "number" },
    enthalpyFlow: { type: "number" },
  },
  required: ["shiftedSpecificEnthalpy", "enthalpyFlow"],
} as const;
/** Constant-cp reference shift holding the physical stream state fixed; no phase-change enthalpy is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    enthalpy,
    oldReferenceTemperature,
    newReferenceTemperature,
    heatCapacity,
    massFlow,
  } = request;
  const compute = (): Output => {
    H.domain(heatCapacity >= 0 && massFlow >= 0);
    return {
      shiftedSpecificEnthalpy:
        enthalpy +
        heatCapacity * (oldReferenceTemperature - newReferenceTemperature),
      enthalpyFlow:
        massFlow *
        (enthalpy +
          heatCapacity * (oldReferenceTemperature - newReferenceTemperature)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    enthalpy: 100,
    oldReferenceTemperature: 20,
    newReferenceTemperature: 30,
    heatCapacity: 2,
    massFlow: 5,
  },
  output: { shiftedSpecificEnthalpy: 80, enthalpyFlow: 400 },
} satisfies ToolExample<Input, Output>;
export const processStreamEnthalpyReferenceShiftTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/process-stream-enthalpy-reference-shift",
      title: "Process Stream Enthalpy Reference Shift Tool",
      description:
        "Constant-cp reference shift holding the physical stream state fixed; no phase-change enthalpy is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          enthalpy: { type: "number" },
          oldReferenceTemperature: { type: "number" },
          newReferenceTemperature: { type: "number" },
          heatCapacity: { type: "number", minimum: 0 },
          massFlow: { type: "number", minimum: 0 },
        },
        required: [
          "enthalpy",
          "oldReferenceTemperature",
          "newReferenceTemperature",
          "heatCapacity",
          "massFlow",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shiftedSpecificEnthalpy: { type: "number" },
          enthalpyFlow: { type: "number" },
        },
        required: ["shiftedSpecificEnthalpy", "enthalpyFlow"],
      },
      ports: {
        inputs: [
          {
            id: "enthalpy",
            label: "Enthalpy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldReferenceTemperature",
            label: "Old Reference Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newReferenceTemperature",
            label: "New Reference Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "heatCapacity",
            label: "Heat Capacity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "massFlow",
            label: "Mass Flow",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "shiftedSpecificEnthalpy",
            label: "Shifted Specific Enthalpy",
            valueType: { type: "number" },
          },
          {
            id: "enthalpyFlow",
            label: "Enthalpy Flow",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = processStreamEnthalpyReferenceShiftTool.execute;
export default processStreamEnthalpyReferenceShiftTool;
