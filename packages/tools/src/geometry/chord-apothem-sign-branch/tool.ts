import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly chordLength: number;
  readonly positiveBranch: boolean;
};
export type Output = { readonly signedApothem: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    chordLength: { type: "number", minimum: 0 },
    positiveBranch: { type: "boolean" },
  },
  required: ["radius", "chordLength", "positiveBranch"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedApothem: { type: "number" } },
  required: ["signedApothem"],
} as const;
/** Return the selected signed circle chord apothem branch without choosing a geometric side. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, chordLength, positiveBranch } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && chordLength >= 0 && chordLength / 2 <= radius);
    const half = chordLength / 2,
      low = radius - half,
      product = low * (radius + half),
      magnitude =
        half === 0
          ? radius
          : low === 0
            ? 0
            : Number.isFinite(product) && product > 0
              ? Math.sqrt(product)
              : Math.sqrt(low) *
                Math.sqrt(radius) *
                Math.sqrt(1 + half / radius);
    return { signedApothem: (positiveBranch ? 1 : -1) * magnitude };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 5, chordLength: 6, positiveBranch: true },
  output: { signedApothem: 4 },
} satisfies ToolExample<Input, Output>;
export const chordApothemSignBranchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/chord-apothem-sign-branch",
    title: "Chord Apothem Sign Branch Tool",
    description:
      "Return the selected signed circle chord apothem branch without choosing a geometric side.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        chordLength: { type: "number", minimum: 0 },
        positiveBranch: { type: "boolean" },
      },
      required: ["radius", "chordLength", "positiveBranch"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedApothem: { type: "number" } },
      required: ["signedApothem"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chordLength",
          label: "Chord Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveBranch",
          label: "Positive Branch",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedApothem",
          label: "Signed Apothem",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chordApothemSignBranchTool.execute;
export default chordApothemSignBranchTool;
