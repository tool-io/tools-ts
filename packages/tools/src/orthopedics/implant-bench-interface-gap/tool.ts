import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly socketSize: number;
  readonly implantSize: number;
  readonly coatingPerSide: number;
};
export type Output = {
  readonly diametralGap: number;
  readonly radialGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    socketSize: { type: "number", minimum: 0 },
    implantSize: { type: "number", minimum: 0 },
    coatingPerSide: { type: "number", minimum: 0 },
  },
  required: ["socketSize", "implantSize", "coatingPerSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diametralGap: { type: "number" },
    radialGap: { type: "number" },
  },
  required: ["diametralGap", "radialGap"],
} as const;
/** Signed nominal bench clearance between supplied concentric diameters, without implant sizing advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { socketSize, implantSize, coatingPerSide } = request;
  const compute = (): Output => {
    H.domain(socketSize >= 0 && implantSize >= 0 && coatingPerSide >= 0);
    return {
      diametralGap: socketSize - implantSize - 2 * coatingPerSide,
      radialGap: (socketSize - implantSize - 2 * coatingPerSide) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { socketSize: 12, implantSize: 10, coatingPerSide: 0.5 },
  output: { diametralGap: 1, radialGap: 0.5 },
} satisfies ToolExample<Input, Output>;
export const implantBenchInterfaceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/implant-bench-interface-gap",
    title: "Implant Bench Interface Gap Tool",
    description:
      "Signed nominal bench clearance between supplied concentric diameters, without implant sizing advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        socketSize: { type: "number", minimum: 0 },
        implantSize: { type: "number", minimum: 0 },
        coatingPerSide: { type: "number", minimum: 0 },
      },
      required: ["socketSize", "implantSize", "coatingPerSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diametralGap: { type: "number" },
        radialGap: { type: "number" },
      },
      required: ["diametralGap", "radialGap"],
    },
    ports: {
      inputs: [
        {
          id: "socketSize",
          label: "Socket Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "implantSize",
          label: "Implant Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coatingPerSide",
          label: "Coating Per Side",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "diametralGap",
          label: "Diametral Gap",
          valueType: { type: "number" },
        },
        { id: "radialGap", label: "Radial Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = implantBenchInterfaceGapTool.execute;
export default implantBenchInterfaceGapTool;
