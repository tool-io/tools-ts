import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scalar: number };
export type Output = {
  readonly isolate: boolean;
  readonly terminator: boolean;
  readonly direction: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scalar: { type: "integer" } },
  required: ["scalar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isolate: { type: "boolean" },
    terminator: { type: "boolean" },
    direction: { type: "string", maxLength: 8192 },
  },
  required: ["isolate", "terminator", "direction"],
} as const;
/** Calculate unicode scalar bidi isolate marker from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scalar } = request;
  const compute = (): Output => {
    H.codePoint(scalar);
    return {
      isolate: scalar >= 8294 && scalar <= 8296,
      terminator: scalar === 8297,
      direction:
        scalar === 8294
          ? "ltr"
          : scalar === 8295
            ? "rtl"
            : scalar === 8296
              ? "first-strong"
              : scalar === 8297
                ? "pop"
                : "none",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scalar: 8295 },
  output: { isolate: true, terminator: false, direction: "rtl" },
} satisfies ToolExample<Input, Output>;
export const unicodeScalarBidiIsolateMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-scalar-bidi-isolate-marker",
    title: "Unicode Scalar Bidi Isolate Marker Tool",
    description:
      "Calculate unicode scalar bidi isolate marker from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scalar: { type: "integer" } },
      required: ["scalar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        isolate: { type: "boolean" },
        terminator: { type: "boolean" },
        direction: { type: "string", maxLength: 8192 },
      },
      required: ["isolate", "terminator", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "scalar",
          label: "Scalar",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "isolate", label: "Isolate", valueType: { type: "boolean" } },
        {
          id: "terminator",
          label: "Terminator",
          valueType: { type: "boolean" },
        },
        { id: "direction", label: "Direction", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = unicodeScalarBidiIsolateMarkerTool.execute;
export default unicodeScalarBidiIsolateMarkerTool;
