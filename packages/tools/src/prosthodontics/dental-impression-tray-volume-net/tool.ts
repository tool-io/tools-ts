import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossVolume: number;
  readonly spacerVolume: number;
  readonly handleVolume: number;
  readonly spacerHandleOverlap: number;
};
export type Output = {
  readonly excludedVolume: number;
  readonly netVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossVolume: { type: "number", minimum: 0 },
    spacerVolume: { type: "number", minimum: 0 },
    handleVolume: { type: "number", minimum: 0 },
    spacerHandleOverlap: { type: "number", minimum: 0 },
  },
  required: [
    "grossVolume",
    "spacerVolume",
    "handleVolume",
    "spacerHandleOverlap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excludedVolume: { type: "number" },
    netVolume: { type: "number" },
  },
  required: ["excludedVolume", "netVolume"],
} as const;
/** Calculate dental impression tray volume net from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossVolume, spacerVolume, handleVolume, spacerHandleOverlap } =
    request;
  const compute = (): Output => {
    H.domain(
      grossVolume >= 0 &&
        spacerVolume >= 0 &&
        handleVolume >= 0 &&
        spacerHandleOverlap >= 0 &&
        spacerHandleOverlap <= Math.min(spacerVolume, handleVolume) &&
        spacerVolume + handleVolume - spacerHandleOverlap <= grossVolume,
    );
    return {
      excludedVolume: spacerVolume + handleVolume - spacerHandleOverlap,
      netVolume:
        grossVolume - spacerVolume - handleVolume + spacerHandleOverlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossVolume: 100,
    spacerVolume: 20,
    handleVolume: 10,
    spacerHandleOverlap: 2,
  },
  output: { excludedVolume: 28, netVolume: 72 },
} satisfies ToolExample<Input, Output>;
export const dentalImpressionTrayVolumeNetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/dental-impression-tray-volume-net",
    title: "Dental Impression Tray Volume Net Tool",
    description:
      "Calculate dental impression tray volume net from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossVolume: { type: "number", minimum: 0 },
        spacerVolume: { type: "number", minimum: 0 },
        handleVolume: { type: "number", minimum: 0 },
        spacerHandleOverlap: { type: "number", minimum: 0 },
      },
      required: [
        "grossVolume",
        "spacerVolume",
        "handleVolume",
        "spacerHandleOverlap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excludedVolume: { type: "number" },
        netVolume: { type: "number" },
      },
      required: ["excludedVolume", "netVolume"],
    },
    ports: {
      inputs: [
        {
          id: "grossVolume",
          label: "Gross Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacerVolume",
          label: "Spacer Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "handleVolume",
          label: "Handle Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacerHandleOverlap",
          label: "Spacer Handle Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "excludedVolume",
          label: "Excluded Volume",
          valueType: { type: "number" },
        },
        { id: "netVolume", label: "Net Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dentalImpressionTrayVolumeNetTool.execute;
export default dentalImpressionTrayVolumeNetTool;
