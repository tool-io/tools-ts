import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly nearInfrared: number; readonly redEdge: number };
export type Output = { readonly ndre: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nearInfrared: { type: "number" }, redEdge: { type: "number" } },
  required: ["nearInfrared", "redEdge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ndre: { type: "number" } },
  required: ["ndre"],
} as const;
/** Calculate canopy ndre one band pair term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nearInfrared, redEdge } = request;
  const compute = (): Output => {
    H.domain(nearInfrared + redEdge !== 0);
    return { ndre: (nearInfrared - redEdge) / (nearInfrared + redEdge) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nearInfrared: 0.6, redEdge: 0.2 },
  output: { ndre: 0.49999999999999994 },
} satisfies ToolExample<Input, Output>;
export const canopyNdreOneBandPairTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/canopy-ndre-one-band-pair-term",
    title: "Canopy Ndre One Band Pair Term Tool",
    description:
      "Calculate canopy ndre one band pair term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nearInfrared: { type: "number" },
        redEdge: { type: "number" },
      },
      required: ["nearInfrared", "redEdge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ndre: { type: "number" } },
      required: ["ndre"],
    },
    ports: {
      inputs: [
        {
          id: "nearInfrared",
          label: "Near Infrared",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "redEdge",
          label: "Red Edge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ndre", label: "Ndre", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = canopyNdreOneBandPairTermTool.execute;
export default canopyNdreOneBandPairTermTool;
