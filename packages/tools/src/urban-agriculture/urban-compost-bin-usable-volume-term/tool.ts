import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly depth: number;
  readonly height: number;
  readonly headspace: number;
  readonly occupied: number;
};
export type Output = {
  readonly usableCapacity: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    height: { type: "number" },
    headspace: { type: "number", minimum: 0 },
    occupied: { type: "number", minimum: 0 },
  },
  required: ["width", "depth", "height", "headspace", "occupied"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableCapacity: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["usableCapacity", "remaining"],
} as const;
/** Calculate urban compost bin usable volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, depth, height, headspace, occupied } = request;
  const compute = (): Output => {
    H.domain(
      width >= 0 &&
        depth >= 0 &&
        height >= headspace &&
        headspace >= 0 &&
        occupied >= 0,
    );
    return {
      usableCapacity: width * depth * (height - headspace),
      remaining: width * depth * (height - headspace) - occupied,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 2, depth: 1, height: 1, headspace: 0.2, occupied: 0.5 },
  output: { usableCapacity: 1.6, remaining: 1.1 },
} satisfies ToolExample<Input, Output>;
export const urbanCompostBinUsableVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/urban-compost-bin-usable-volume-term",
    title: "Urban Compost Bin Usable Volume Term Tool",
    description:
      "Calculate urban compost bin usable volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        height: { type: "number" },
        headspace: { type: "number", minimum: 0 },
        occupied: { type: "number", minimum: 0 },
      },
      required: ["width", "depth", "height", "headspace", "occupied"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableCapacity: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["usableCapacity", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "headspace",
          label: "Headspace",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupied",
          label: "Occupied",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableCapacity",
          label: "Usable Capacity",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = urbanCompostBinUsableVolumeTermTool.execute;
export default urbanCompostBinUsableVolumeTermTool;
