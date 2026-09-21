import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly greasyMass: number;
  readonly cleanMass: number;
  readonly moistureAdjustment: number;
};
export type Output = {
  readonly cleanYield: number;
  readonly totalLoss: number;
  readonly adjustedCleanMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    greasyMass: { type: "number", exclusiveMinimum: 0 },
    cleanMass: { type: "number", minimum: 0 },
    moistureAdjustment: { type: "number", minimum: 0 },
  },
  required: ["greasyMass", "cleanMass", "moistureAdjustment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cleanYield: { type: "number" },
    totalLoss: { type: "number" },
    adjustedCleanMass: { type: "number" },
  },
  required: ["cleanYield", "totalLoss", "adjustedCleanMass"],
} as const;
/** Calculate fleece clean yield grease loss from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { greasyMass, cleanMass, moistureAdjustment } = request;
  const compute = (): Output => {
    H.positive(greasyMass);
    H.domain(
      cleanMass >= 0 && cleanMass <= greasyMass && moistureAdjustment >= 0,
    );
    return {
      cleanYield: cleanMass / greasyMass,
      totalLoss: greasyMass - cleanMass,
      adjustedCleanMass: cleanMass * moistureAdjustment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { greasyMass: 10, cleanMass: 6, moistureAdjustment: 1.1 },
  output: {
    cleanYield: 0.6,
    totalLoss: 4,
    adjustedCleanMass: 6.6000000000000005,
  },
} satisfies ToolExample<Input, Output>;
export const fleeceCleanYieldGreaseLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/fleece-clean-yield-grease-loss",
    title: "Fleece Clean Yield Grease Loss Tool",
    description:
      "Calculate fleece clean yield grease loss from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        greasyMass: { type: "number", exclusiveMinimum: 0 },
        cleanMass: { type: "number", minimum: 0 },
        moistureAdjustment: { type: "number", minimum: 0 },
      },
      required: ["greasyMass", "cleanMass", "moistureAdjustment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cleanYield: { type: "number" },
        totalLoss: { type: "number" },
        adjustedCleanMass: { type: "number" },
      },
      required: ["cleanYield", "totalLoss", "adjustedCleanMass"],
    },
    ports: {
      inputs: [
        {
          id: "greasyMass",
          label: "Greasy Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cleanMass",
          label: "Clean Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureAdjustment",
          label: "Moisture Adjustment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cleanYield",
          label: "Clean Yield",
          valueType: { type: "number" },
        },
        { id: "totalLoss", label: "Total Loss", valueType: { type: "number" } },
        {
          id: "adjustedCleanMass",
          label: "Adjusted Clean Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fleeceCleanYieldGreaseLossTool.execute;
export default fleeceCleanYieldGreaseLossTool;
