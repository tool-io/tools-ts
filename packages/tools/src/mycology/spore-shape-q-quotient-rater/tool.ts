import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SporeShapeQQuotientRaterInput = {
  readonly lengthUm: number;
  readonly widthUm: number;
};

export type SporeShapeQQuotientRaterOutput = {
  readonly q: number;
};

export const sporeShapeQQuotientRaterExample = {
  input: { lengthUm: 10, widthUm: 10 },
  output: { q: 1 },
} satisfies ToolExample<
  SporeShapeQQuotientRaterInput,
  SporeShapeQQuotientRaterOutput
>;

export const sporeShapeQQuotientRaterTool = createSimpleTool({
  id: "mycology/spore-shape-q-quotient-rater",
  title: "Q Quotient Rater",
  description:
    "Calculate the dimensionless spore Q quotient as length divided by width without inferring curvature or outline from the ratio alone.",
  inputs: [
    { id: "lengthUm", label: "Spore length", kind: "number", unit: "µm" },
    { id: "widthUm", label: "Spore width", kind: "number", unit: "µm" },
  ],
  outputs: [{ id: "q", label: "Q quotient", kind: "number" }],
  calculate: (input) => {
    const lengthUm = input.lengthUm as number;
    const widthUm = input.widthUm as number;
    if (!(lengthUm > 0))
      simpleError("lengthUm", "Spore length must be positive.");
    if (!(widthUm > 0)) simpleError("widthUm", "Spore width must be positive.");
    const q = lengthUm / widthUm;
    return { q };
  },
});
export const runSporeShapeQQuotientRater = sporeShapeQQuotientRaterTool.execute;
export default sporeShapeQQuotientRaterTool;
