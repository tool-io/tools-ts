import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moisture: number;
  readonly dryConcentration: number;
  readonly background: number;
};
export type Output = { readonly dryMass: number; readonly netLoad: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moisture: { type: "number", minimum: 0, maximum: 1 },
    dryConcentration: { type: "number" },
    background: { type: "number" },
  },
  required: ["wetMass", "moisture", "dryConcentration", "background"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" }, netLoad: { type: "number" } },
  required: ["dryMass", "netLoad"],
} as const;
/** Calculate bioremediation moisture adjusted load from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moisture, dryConcentration, background } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0 && moisture >= 0 && moisture <= 1);
    return {
      dryMass: wetMass * (1 - moisture),
      netLoad: wetMass * (1 - moisture) * (dryConcentration - background),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, moisture: 0.2, dryConcentration: 5, background: 1 },
  output: { dryMass: 80, netLoad: 320 },
} satisfies ToolExample<Input, Output>;
export const bioremediationMoistureAdjustedLoadTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/bioremediation-moisture-adjusted-load",
    title: "Bioremediation Moisture Adjusted Load Tool",
    description:
      "Calculate bioremediation moisture adjusted load from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        moisture: { type: "number", minimum: 0, maximum: 1 },
        dryConcentration: { type: "number" },
        background: { type: "number" },
      },
      required: ["wetMass", "moisture", "dryConcentration", "background"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryMass: { type: "number" }, netLoad: { type: "number" } },
      required: ["dryMass", "netLoad"],
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
          id: "moisture",
          label: "Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryConcentration",
          label: "Dry Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        { id: "netLoad", label: "Net Load", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bioremediationMoistureAdjustedLoadTool.execute;
export default bioremediationMoistureAdjustedLoadTool;
