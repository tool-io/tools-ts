import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly dryMass: number;
  readonly saturatedMass: number;
};
export type Output = {
  readonly waterMass: number;
  readonly relativeHolding: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number" },
    dryMass: { type: "number", minimum: 0 },
    saturatedMass: { type: "number" },
  },
  required: ["wetMass", "dryMass", "saturatedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number" },
    relativeHolding: { type: "number" },
  },
  required: ["waterMass", "relativeHolding"],
} as const;
/** Calculate hydroponic grow plug water holding term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, dryMass, saturatedMass } = request;
  const compute = (): Output => {
    H.domain(
      saturatedMass > dryMass &&
        dryMass >= 0 &&
        wetMass >= dryMass &&
        wetMass <= saturatedMass,
    );
    return {
      waterMass: wetMass - dryMass,
      relativeHolding: (wetMass - dryMass) / (saturatedMass - dryMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 8, dryMass: 2, saturatedMass: 10 },
  output: { waterMass: 6, relativeHolding: 0.75 },
} satisfies ToolExample<Input, Output>;
export const hydroponicGrowPlugWaterHoldingTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/hydroponic-grow-plug-water-holding-term",
    title: "Hydroponic Grow Plug Water Holding Term Tool",
    description:
      "Calculate hydroponic grow plug water holding term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number" },
        dryMass: { type: "number", minimum: 0 },
        saturatedMass: { type: "number" },
      },
      required: ["wetMass", "dryMass", "saturatedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number" },
        relativeHolding: { type: "number" },
      },
      required: ["waterMass", "relativeHolding"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "saturatedMass",
          label: "Saturated Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
        {
          id: "relativeHolding",
          label: "Relative Holding",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydroponicGrowPlugWaterHoldingTermTool.execute;
export default hydroponicGrowPlugWaterHoldingTermTool;
