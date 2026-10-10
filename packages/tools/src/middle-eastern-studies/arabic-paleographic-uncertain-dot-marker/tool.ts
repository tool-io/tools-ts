import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly suppliedReading: string;
  readonly uncertaintyMarker: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReading: { type: "string", maxLength: 8192, minLength: 1 },
    uncertaintyMarker: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "suppliedReading", "uncertaintyMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit paleographic reading and uncertainty marker without resolving letter forms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, suppliedReading, uncertaintyMarker } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(suppliedReading.length > 0, "suppliedReading");
    H.domain(uncertaintyMarker.length > 0, "uncertaintyMarker");
    return {
      token: JSON.stringify([sourceId, suppliedReading, uncertaintyMarker]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "SRC17",
    suppliedReading: "Reading A",
    uncertaintyMarker: "dot uncertain",
  },
  output: { token: '["SRC17","Reading A","dot uncertain"]' },
} satisfies ToolExample<Input, Output>;
export const arabicPaleographicUncertainDotMarkerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "middle-eastern-studies",
          "middle eastern studies",
          "humanities",
        ],
        keywords: ["middle eastern studies", "humanities"],
      },
      id: "middle-eastern-studies/arabic-paleographic-uncertain-dot-marker",
      title: "Arabic Paleographic Uncertain Dot Marker",
      description:
        "Preserve an explicit paleographic reading and uncertainty marker without resolving letter forms.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedReading: { type: "string", maxLength: 8192, minLength: 1 },
          uncertaintyMarker: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sourceId", "suppliedReading", "uncertaintyMarker"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedReading",
            label: "Supplied Reading",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "uncertaintyMarker",
            label: "Uncertainty Marker",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = arabicPaleographicUncertainDotMarkerTool.execute;
export default arabicPaleographicUncertainDotMarkerTool;
