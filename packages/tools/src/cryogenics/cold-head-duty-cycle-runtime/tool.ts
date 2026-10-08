import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedHours: number;
  readonly onFraction: number;
  readonly ratedOnPowerWatts: number;
};
export type Output = {
  readonly onHours: number;
  readonly inputEnergyWattHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedHours: { type: "number", minimum: 0 },
    onFraction: { type: "number", minimum: 0, maximum: 1 },
    ratedOnPowerWatts: { type: "number", minimum: 0 },
  },
  required: ["elapsedHours", "onFraction", "ratedOnPowerWatts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onHours: { type: "number" },
    inputEnergyWattHours: { type: "number" },
  },
  required: ["onHours", "inputEnergyWattHours"],
} as const;
/** Convert an explicit cold-head on-duty fraction into on-time and constant-on-power input energy without estimating refrigeration capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedHours, onFraction, ratedOnPowerWatts } = request;
  const compute = (): Output => {
    H.domain(elapsedHours >= 0 && ratedOnPowerWatts >= 0, "elapsedHours");
    (H.domain(onFraction >= 0 && onFraction <= 1, "onFraction"), onFraction);
    return {
      onHours: elapsedHours * onFraction,
      inputEnergyWattHours: elapsedHours * onFraction * ratedOnPowerWatts,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedHours: 8, onFraction: 0.25, ratedOnPowerWatts: 100 },
  output: { onHours: 2, inputEnergyWattHours: 200 },
} satisfies ToolExample<Input, Output>;
export const coldHeadDutyCycleRuntimeTool = H.defineSchemaCalculation<
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
    id: "cryogenics/cold-head-duty-cycle-runtime",
    title: "Cold Head Duty Cycle Runtime",
    description:
      "Convert an explicit cold-head on-duty fraction into on-time and constant-on-power input energy without estimating refrigeration capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedHours: { type: "number", minimum: 0 },
        onFraction: { type: "number", minimum: 0, maximum: 1 },
        ratedOnPowerWatts: { type: "number", minimum: 0 },
      },
      required: ["elapsedHours", "onFraction", "ratedOnPowerWatts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onHours: { type: "number" },
        inputEnergyWattHours: { type: "number" },
      },
      required: ["onHours", "inputEnergyWattHours"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "onFraction",
          label: "On Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratedOnPowerWatts",
          label: "Rated On Power Watts",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "onHours", label: "On Hours", valueType: { type: "number" } },
        {
          id: "inputEnergyWattHours",
          label: "Input Energy Watt Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coldHeadDutyCycleRuntimeTool.execute;
export default coldHeadDutyCycleRuntimeTool;
