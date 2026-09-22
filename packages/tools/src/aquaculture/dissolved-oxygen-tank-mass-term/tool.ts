import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly volume: number;
  readonly unitFactor: number;
  readonly targetConcentration: number;
};
export type Output = {
  readonly oxygenMass: number;
  readonly targetMassGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    volume: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
    targetConcentration: { type: "number", minimum: 0 },
  },
  required: ["concentration", "volume", "unitFactor", "targetConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oxygenMass: { type: "number" },
    targetMassGap: { type: "number" },
  },
  required: ["oxygenMass", "targetMassGap"],
} as const;
/** Convert supplied concentration and volume to mass using an explicit unit factor; a target is not an aeration recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, volume, unitFactor, targetConcentration } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && volume >= 0 && targetConcentration >= 0);
    H.positive(unitFactor);
    return {
      oxygenMass: concentration * volume * unitFactor,
      targetMassGap:
        (targetConcentration - concentration) * volume * unitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    concentration: 6,
    volume: 10,
    unitFactor: 1,
    targetConcentration: 8,
  },
  output: { oxygenMass: 60, targetMassGap: 20 },
} satisfies ToolExample<Input, Output>;
export const dissolvedOxygenTankMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/dissolved-oxygen-tank-mass-term",
    title: "Dissolved Oxygen Tank Mass Term Tool",
    description:
      "Convert supplied concentration and volume to mass using an explicit unit factor; a target is not an aeration recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        volume: { type: "number", minimum: 0 },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
        targetConcentration: { type: "number", minimum: 0 },
      },
      required: [
        "concentration",
        "volume",
        "unitFactor",
        "targetConcentration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oxygenMass: { type: "number" },
        targetMassGap: { type: "number" },
      },
      required: ["oxygenMass", "targetMassGap"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetConcentration",
          label: "Target Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "oxygenMass",
          label: "Oxygen Mass",
          valueType: { type: "number" },
        },
        {
          id: "targetMassGap",
          label: "Target Mass Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dissolvedOxygenTankMassTermTool.execute;
export default dissolvedOxygenTankMassTermTool;
