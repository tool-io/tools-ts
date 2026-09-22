import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPoreVolume: number;
  readonly scaffoldVolume: number;
  readonly suppliedTargetPorosity: number;
};
export type Output = {
  readonly porosity: number;
  readonly targetPoreVolume: number;
  readonly deficit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPoreVolume: { type: "number", minimum: 0 },
    scaffoldVolume: { type: "number", exclusiveMinimum: 0 },
    suppliedTargetPorosity: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["measuredPoreVolume", "scaffoldVolume", "suppliedTargetPorosity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    porosity: { type: "number" },
    targetPoreVolume: { type: "number" },
    deficit: { type: "number" },
  },
  required: ["porosity", "targetPoreVolume", "deficit"],
} as const;
/** Compare measured bench pore volume with an explicit target, without tissue or material recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPoreVolume, scaffoldVolume, suppliedTargetPorosity } =
    request;
  const compute = (): Output => {
    H.domain(measuredPoreVolume >= 0 && measuredPoreVolume <= scaffoldVolume);
    H.positive(scaffoldVolume);
    H.probability(suppliedTargetPorosity);
    return {
      porosity: measuredPoreVolume / scaffoldVolume,
      targetPoreVolume: scaffoldVolume * suppliedTargetPorosity,
      deficit: scaffoldVolume * suppliedTargetPorosity - measuredPoreVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredPoreVolume: 3,
    scaffoldVolume: 10,
    suppliedTargetPorosity: 0.5,
  },
  output: { porosity: 0.3, targetPoreVolume: 5, deficit: 2 },
} satisfies ToolExample<Input, Output>;
export const scaffoldPoreVolumeDeficitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/scaffold-pore-volume-deficit",
    title: "Scaffold Pore Volume Deficit Tool",
    description:
      "Compare measured bench pore volume with an explicit target, without tissue or material recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPoreVolume: { type: "number", minimum: 0 },
        scaffoldVolume: { type: "number", exclusiveMinimum: 0 },
        suppliedTargetPorosity: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "measuredPoreVolume",
        "scaffoldVolume",
        "suppliedTargetPorosity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        porosity: { type: "number" },
        targetPoreVolume: { type: "number" },
        deficit: { type: "number" },
      },
      required: ["porosity", "targetPoreVolume", "deficit"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPoreVolume",
          label: "Measured Pore Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaffoldVolume",
          label: "Scaffold Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTargetPorosity",
          label: "Supplied Target Porosity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "porosity", label: "Porosity", valueType: { type: "number" } },
        {
          id: "targetPoreVolume",
          label: "Target Pore Volume",
          valueType: { type: "number" },
        },
        { id: "deficit", label: "Deficit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = scaffoldPoreVolumeDeficitTool.execute;
export default scaffoldPoreVolumeDeficitTool;
