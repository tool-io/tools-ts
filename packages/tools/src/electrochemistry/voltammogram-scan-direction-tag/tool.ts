import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousPotential: number;
  readonly currentPotential: number;
};
export type Output = { readonly direction: string; readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousPotential: { type: "number" },
    currentPotential: { type: "number" },
  },
  required: ["previousPotential", "currentPotential"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    direction: { type: "string", maxLength: 8192 },
    increment: { type: "number" },
  },
  required: ["direction", "increment"],
} as const;
/** Label the signed potential change between two explicit voltammogram samples without inferring oxidation or reduction from scan direction alone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousPotential, currentPotential } = request;
  const compute = (): Output => {
    const increment = currentPotential - previousPotential;
    return {
      direction:
        increment > 0
          ? "increasing-potential"
          : increment < 0
            ? "decreasing-potential"
            : "unchanged",
      increment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousPotential: 0.2, currentPotential: 0.3 },
  output: { direction: "increasing-potential", increment: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const voltammogramScanDirectionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electrochemistry", "chemistry"],
      keywords: ["electrochemistry", "chemistry"],
    },
    id: "electrochemistry/voltammogram-scan-direction-tag",
    title: "Voltammogram Scan Direction Tag",
    description:
      "Label the signed potential change between two explicit voltammogram samples without inferring oxidation or reduction from scan direction alone.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousPotential: { type: "number" },
        currentPotential: { type: "number" },
      },
      required: ["previousPotential", "currentPotential"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        direction: { type: "string", maxLength: 8192 },
        increment: { type: "number" },
      },
      required: ["direction", "increment"],
    },
    ports: {
      inputs: [
        {
          id: "previousPotential",
          label: "Previous Potential",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentPotential",
          label: "Current Potential",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "direction", label: "Direction", valueType: { type: "string" } },
        { id: "increment", label: "Increment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = voltammogramScanDirectionTagTool.execute;
export default voltammogramScanDirectionTagTool;
