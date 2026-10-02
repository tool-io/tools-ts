import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surface: string;
  readonly allowedSurfaces: readonly string[];
  readonly inkKnown: boolean;
};
export type Output = {
  readonly recognizedSurface: boolean;
  readonly status: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surface: { type: "string", maxLength: 8192 },
    allowedSurfaces: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    inkKnown: { type: "boolean" },
  },
  required: ["surface", "allowedSurfaces", "inkKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognizedSurface: { type: "boolean" },
    status: { type: "string", maxLength: 8192 },
  },
  required: ["recognizedSurface", "status"],
} as const;
/** Inspect surface and ink metadata only, without inferring margins or pathology findings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surface, allowedSurfaces, inkKnown } = request;
  const compute = (): Output => {
    const recognizedSurface = allowedSurfaces.includes(surface);
    return {
      recognizedSurface,
      status: !recognizedSurface
        ? "unknown-surface"
        : inkKnown
          ? "recorded-ink"
          : "unknown-ink",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surface: "deep",
    allowedSurfaces: ["deep", "lateral"],
    inkKnown: false,
  },
  output: { recognizedSurface: true, status: "unknown-ink" },
} satisfies ToolExample<Input, Output>;
export const specimenInkSurfaceUnknownTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/specimen-ink-surface-unknown-token",
    title: "Specimen Ink Surface Unknown Token Tool",
    description:
      "Inspect surface and ink metadata only, without inferring margins or pathology findings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surface: { type: "string", maxLength: 8192 },
        allowedSurfaces: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        inkKnown: { type: "boolean" },
      },
      required: ["surface", "allowedSurfaces", "inkKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognizedSurface: { type: "boolean" },
        status: { type: "string", maxLength: 8192 },
      },
      required: ["recognizedSurface", "status"],
    },
    ports: {
      inputs: [
        {
          id: "surface",
          label: "Surface",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedSurfaces",
          label: "Allowed Surfaces",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "inkKnown",
          label: "Ink Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recognizedSurface",
          label: "Recognized Surface",
          valueType: { type: "boolean" },
        },
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = specimenInkSurfaceUnknownTokenTool.execute;
export default specimenInkSurfaceUnknownTokenTool;
