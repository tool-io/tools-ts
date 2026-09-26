import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly fineness: number;
  readonly suppliedReferenceFineMass: number;
};
export type Output = { readonly fineMass: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    fineness: { type: "number", minimum: 0, maximum: 1 },
    suppliedReferenceFineMass: { type: "number", minimum: 0 },
  },
  required: ["grossMass", "fineness", "suppliedReferenceFineMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fineMass: { type: "number" }, gap: { type: "number" } },
  required: ["fineMass", "gap"],
} as const;
/** Calculate coinage face fine weight gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, fineness, suppliedReferenceFineMass } = request;
  const compute = (): Output => {
    H.domain(grossMass >= 0 && suppliedReferenceFineMass >= 0);
    H.probability(fineness);
    return {
      fineMass: grossMass * fineness,
      gap: grossMass * fineness - suppliedReferenceFineMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 10, fineness: 0.8, suppliedReferenceFineMass: 7 },
  output: { fineMass: 8, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const coinageFaceFineWeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/coinage-face-fine-weight-gap",
    title: "Coinage Face Fine Weight Gap Tool",
    description:
      "Calculate coinage face fine weight gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        fineness: { type: "number", minimum: 0, maximum: 1 },
        suppliedReferenceFineMass: { type: "number", minimum: 0 },
      },
      required: ["grossMass", "fineness", "suppliedReferenceFineMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fineMass: { type: "number" }, gap: { type: "number" } },
      required: ["fineMass", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fineness",
          label: "Fineness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceFineMass",
          label: "Supplied Reference Fine Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fineMass", label: "Fine Mass", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coinageFaceFineWeightGapTool.execute;
export default coinageFaceFineWeightGapTool;
