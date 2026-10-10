import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalVolumePerCycle: number;
  readonly observedCycles: number;
  readonly observedVolume: number;
};
export type Output = {
  readonly nominalTotalVolume: number;
  readonly observedMinusNominal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalVolumePerCycle: { type: "number", minimum: 0 },
    observedCycles: { type: "integer", minimum: 0 },
    observedVolume: { type: "number", minimum: 0 },
  },
  required: ["nominalVolumePerCycle", "observedCycles", "observedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalTotalVolume: { type: "number" },
    observedMinusNominal: { type: "number" },
  },
  required: ["nominalTotalVolume", "observedMinusNominal"],
} as const;
/** Compare explicit observed pump volume with supplied nominal displacement times cycle count without calibrating equipment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalVolumePerCycle, observedCycles, observedVolume } = request;
  const compute = (): Output => {
    H.domain(
      nominalVolumePerCycle >= 0 && observedVolume >= 0,
      "nominalVolumePerCycle",
    );
    (H.domain(
      Number.isSafeInteger(observedCycles) &&
        observedCycles >= 0 &&
        observedCycles <= Number.MAX_SAFE_INTEGER,
      "observedCycles",
    ),
      observedCycles);
    return {
      nominalTotalVolume: nominalVolumePerCycle * observedCycles,
      observedMinusNominal:
        observedVolume - nominalVolumePerCycle * observedCycles,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalVolumePerCycle: 2, observedCycles: 10, observedVolume: 19 },
  output: { nominalTotalVolume: 20, observedMinusNominal: -1 },
} satisfies ToolExample<Input, Output>;
export const hydroponicPumpDisplacementCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/hydroponic-pump-displacement-check",
    title: "Hydroponic Pump Displacement Check",
    description:
      "Compare explicit observed pump volume with supplied nominal displacement times cycle count without calibrating equipment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalVolumePerCycle: { type: "number", minimum: 0 },
        observedCycles: { type: "integer", minimum: 0 },
        observedVolume: { type: "number", minimum: 0 },
      },
      required: ["nominalVolumePerCycle", "observedCycles", "observedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalTotalVolume: { type: "number" },
        observedMinusNominal: { type: "number" },
      },
      required: ["nominalTotalVolume", "observedMinusNominal"],
    },
    ports: {
      inputs: [
        {
          id: "nominalVolumePerCycle",
          label: "Nominal Volume Per Cycle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedCycles",
          label: "Observed Cycles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedVolume",
          label: "Observed Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalTotalVolume",
          label: "Nominal Total Volume",
          valueType: { type: "number" },
        },
        {
          id: "observedMinusNominal",
          label: "Observed Minus Nominal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydroponicPumpDisplacementCheckTool.execute;
export default hydroponicPumpDisplacementCheckTool;
