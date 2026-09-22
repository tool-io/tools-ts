import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly disappearanceDepth: number;
  readonly reappearanceDepth: number;
};
export type Output = { readonly midpoint: number; readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disappearanceDepth: { type: "number", minimum: 0 },
    reappearanceDepth: { type: "number", minimum: 0 },
  },
  required: ["disappearanceDepth", "reappearanceDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" }, signedGap: { type: "number" } },
  required: ["midpoint", "signedGap"],
} as const;
/** Calculate secchi depth interval gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { disappearanceDepth, reappearanceDepth } = request;
  const compute = (): Output => {
    H.domain(disappearanceDepth >= 0 && reappearanceDepth >= 0);
    return {
      midpoint: disappearanceDepth / 2 + reappearanceDepth / 2,
      signedGap: disappearanceDepth - reappearanceDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { disappearanceDepth: 4, reappearanceDepth: 3 },
  output: { midpoint: 3.5, signedGap: 1 },
} satisfies ToolExample<Input, Output>;
export const secchiDepthIntervalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/secchi-depth-interval-gap",
    title: "Secchi Depth Interval Gap Tool",
    description:
      "Calculate secchi depth interval gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        disappearanceDepth: { type: "number", minimum: 0 },
        reappearanceDepth: { type: "number", minimum: 0 },
      },
      required: ["disappearanceDepth", "reappearanceDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpoint: { type: "number" },
        signedGap: { type: "number" },
      },
      required: ["midpoint", "signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "disappearanceDepth",
          label: "Disappearance Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reappearanceDepth",
          label: "Reappearance Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = secchiDepthIntervalGapTool.execute;
export default secchiDepthIntervalGapTool;
