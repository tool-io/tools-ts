import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wallWidth: number;
  readonly firstOverhang: number;
  readonly secondOverhang: number;
};
export type Output = { readonly copingWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallWidth: { type: "number", minimum: 0 },
    firstOverhang: { type: "number", minimum: 0 },
    secondOverhang: { type: "number", minimum: 0 },
  },
  required: ["wallWidth", "firstOverhang", "secondOverhang"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { copingWidth: { type: "number" } },
  required: ["copingWidth"],
} as const;
/** Calculate parapet coping drip edge extension from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wallWidth, firstOverhang, secondOverhang } = request;
  const compute = (): Output => {
    H.domain(wallWidth >= 0 && firstOverhang >= 0 && secondOverhang >= 0);
    return { copingWidth: wallWidth + firstOverhang + secondOverhang };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wallWidth: 0.3, firstOverhang: 0.05, secondOverhang: 0.05 },
  output: { copingWidth: 0.39999999999999997 },
} satisfies ToolExample<Input, Output>;
export const parapetCopingDripEdgeExtensionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/parapet-coping-drip-edge-extension",
    title: "Parapet Coping Drip Edge Extension Tool",
    description:
      "Calculate parapet coping drip edge extension from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wallWidth: { type: "number", minimum: 0 },
        firstOverhang: { type: "number", minimum: 0 },
        secondOverhang: { type: "number", minimum: 0 },
      },
      required: ["wallWidth", "firstOverhang", "secondOverhang"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { copingWidth: { type: "number" } },
      required: ["copingWidth"],
    },
    ports: {
      inputs: [
        {
          id: "wallWidth",
          label: "Wall Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOverhang",
          label: "First Overhang",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOverhang",
          label: "Second Overhang",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "copingWidth",
          label: "Coping Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = parapetCopingDripEdgeExtensionTool.execute;
export default parapetCopingDripEdgeExtensionTool;
