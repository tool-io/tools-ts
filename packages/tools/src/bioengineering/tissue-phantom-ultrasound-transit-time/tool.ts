import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thickness: number;
  readonly soundSpeed: number;
  readonly twoWay: boolean;
};
export type Output = { readonly transitSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thickness: { type: "number", minimum: 0 },
    soundSpeed: { type: "number", exclusiveMinimum: 0 },
    twoWay: { type: "boolean" },
  },
  required: ["thickness", "soundSpeed", "twoWay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transitSeconds: { type: "number" } },
  required: ["transitSeconds"],
} as const;
/** Calculate tissue phantom ultrasound transit time from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thickness, soundSpeed, twoWay } = request;
  const compute = (): Output => {
    H.domain(thickness >= 0);
    H.positive(soundSpeed);
    return { transitSeconds: (thickness * (twoWay ? 2 : 1)) / soundSpeed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thickness: 0.03, soundSpeed: 1500, twoWay: true },
  output: { transitSeconds: 0.000039999999999999996 },
} satisfies ToolExample<Input, Output>;
export const tissuePhantomUltrasoundTransitTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/tissue-phantom-ultrasound-transit-time",
    title: "Tissue Phantom Ultrasound Transit Time Tool",
    description:
      "Calculate tissue phantom ultrasound transit time from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thickness: { type: "number", minimum: 0 },
        soundSpeed: { type: "number", exclusiveMinimum: 0 },
        twoWay: { type: "boolean" },
      },
      required: ["thickness", "soundSpeed", "twoWay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transitSeconds: { type: "number" } },
      required: ["transitSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "soundSpeed",
          label: "Sound Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "twoWay",
          label: "Two Way",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "transitSeconds",
          label: "Transit Seconds",
          valueType: { type: "number", unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissuePhantomUltrasoundTransitTimeTool.execute;
export default tissuePhantomUltrasoundTransitTimeTool;
