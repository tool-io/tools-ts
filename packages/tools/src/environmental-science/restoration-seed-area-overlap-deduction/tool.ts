import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstArea: number;
  readonly secondArea: number;
  readonly overlap: number;
  readonly seedPerArea: number;
};
export type Output = { readonly netArea: number; readonly seedAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstArea: { type: "number", minimum: 0 },
    secondArea: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
    seedPerArea: { type: "number", minimum: 0 },
  },
  required: ["firstArea", "secondArea", "overlap", "seedPerArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netArea: { type: "number" }, seedAmount: { type: "number" } },
  required: ["netArea", "seedAmount"],
} as const;
/** Calculate restoration seed area overlap deduction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstArea, secondArea, overlap, seedPerArea } = request;
  const compute = (): Output => {
    H.domain(
      firstArea >= 0 &&
        secondArea >= 0 &&
        overlap >= 0 &&
        overlap <= Math.min(firstArea, secondArea) &&
        seedPerArea >= 0,
    );
    return {
      netArea: firstArea + secondArea - overlap,
      seedAmount: (firstArea + secondArea - overlap) * seedPerArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstArea: 100, secondArea: 80, overlap: 20, seedPerArea: 0.03 },
  output: { netArea: 160, seedAmount: 4.8 },
} satisfies ToolExample<Input, Output>;
export const restorationSeedAreaOverlapDeductionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-science/restoration-seed-area-overlap-deduction",
      title: "Restoration Seed Area Overlap Deduction Tool",
      description:
        "Calculate restoration seed area overlap deduction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstArea: { type: "number", minimum: 0 },
          secondArea: { type: "number", minimum: 0 },
          overlap: { type: "number", minimum: 0 },
          seedPerArea: { type: "number", minimum: 0 },
        },
        required: ["firstArea", "secondArea", "overlap", "seedPerArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netArea: { type: "number" },
          seedAmount: { type: "number" },
        },
        required: ["netArea", "seedAmount"],
      },
      ports: {
        inputs: [
          {
            id: "firstArea",
            label: "First Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondArea",
            label: "Second Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overlap",
            label: "Overlap",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "seedPerArea",
            label: "Seed Per Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "netArea", label: "Net Area", valueType: { type: "number" } },
          {
            id: "seedAmount",
            label: "Seed Amount",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = restorationSeedAreaOverlapDeductionTool.execute;
export default restorationSeedAreaOverlapDeductionTool;
