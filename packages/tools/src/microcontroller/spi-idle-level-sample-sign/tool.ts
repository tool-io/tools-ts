import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cpol: number;
  readonly cpha: number;
  readonly edge: string;
};
export type Output = {
  readonly idleLevel: number;
  readonly sampleEdge: string;
  readonly samplesOnGivenEdge: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cpol: { type: "integer", minimum: 0, maximum: 1 },
    cpha: { type: "integer", minimum: 0, maximum: 1 },
    edge: { type: "string", maxLength: 8192, enum: ["rising", "falling"] },
  },
  required: ["cpol", "cpha", "edge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idleLevel: { type: "integer" },
    sampleEdge: { type: "string", maxLength: 8192 },
    samplesOnGivenEdge: { type: "boolean" },
  },
  required: ["idleLevel", "sampleEdge", "samplesOnGivenEdge"],
} as const;
/** Resolve the sampling edge from supplied SPI CPOL/CPHA bits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cpol, cpha, edge } = request;
  const compute = (): Output => {
    H.integer(cpol, 0, 1);
    H.integer(cpha, 0, 1);
    H.domain(["rising", "falling"].includes(edge));
    const leading = cpol === 0 ? "rising" : "falling",
      sampleEdge =
        cpha === 0 ? leading : leading === "rising" ? "falling" : "rising";
    return {
      idleLevel: cpol,
      sampleEdge,
      samplesOnGivenEdge: sampleEdge === edge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cpol: 0, cpha: 0, edge: "rising" },
  output: { idleLevel: 0, sampleEdge: "rising", samplesOnGivenEdge: true },
} satisfies ToolExample<Input, Output>;
export const spiIdleLevelSampleSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/spi-idle-level-sample-sign",
    title: "SPI Idle Level Sample Sign Tool",
    description: "Resolve the sampling edge from supplied SPI CPOL/CPHA bits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cpol: { type: "integer", minimum: 0, maximum: 1 },
        cpha: { type: "integer", minimum: 0, maximum: 1 },
        edge: { type: "string", maxLength: 8192, enum: ["rising", "falling"] },
      },
      required: ["cpol", "cpha", "edge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idleLevel: { type: "integer" },
        sampleEdge: { type: "string", maxLength: 8192 },
        samplesOnGivenEdge: { type: "boolean" },
      },
      required: ["idleLevel", "sampleEdge", "samplesOnGivenEdge"],
    },
    ports: {
      inputs: [
        {
          id: "cpol",
          label: "Cpol",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cpha",
          label: "Cpha",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "edge",
          label: "Edge",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "idleLevel",
          label: "Idle Level",
          valueType: { type: "integer" },
        },
        {
          id: "sampleEdge",
          label: "Sample Edge",
          valueType: { type: "string" },
        },
        {
          id: "samplesOnGivenEdge",
          label: "Samples On Given Edge",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = spiIdleLevelSampleSignTool.execute;
export default spiIdleLevelSampleSignTool;
