import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pointId: string;
  readonly recordedPosition: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pointId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedPosition: {
      type: "string",
      maxLength: 8192,
      enum: ["upstream", "downstream", "reference", "unspecified"],
    },
  },
  required: ["pointId", "recordedPosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded monitoring-point relation without inferring flow direction from coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pointId, recordedPosition } = request;
  const compute = (): Output => {
    H.domain(pointId.length > 0, "pointId");
    H.domain(
      ["upstream", "downstream", "reference", "unspecified"].includes(
        recordedPosition,
      ),
      "recordedPosition",
    );
    return { label: pointId + " [" + recordedPosition + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pointId: "P17", recordedPosition: "upstream" },
  output: { label: "P17 [upstream]" },
} satisfies ToolExample<Input, Output>;
export const monitoringPointUpstreamDownstreamCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "environmental-science",
          "environmental science",
          "earth and environmental sciences",
        ],
        keywords: ["environmental science", "earth and environmental sciences"],
      },
      id: "environmental-science/monitoring-point-upstream-downstream-code",
      title: "Monitoring Point Upstream Downstream Code",
      description:
        "Label an explicitly recorded monitoring-point relation without inferring flow direction from coordinates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pointId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedPosition: {
            type: "string",
            maxLength: 8192,
            enum: ["upstream", "downstream", "reference", "unspecified"],
          },
        },
        required: ["pointId", "recordedPosition"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "pointId",
            label: "Point Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "recordedPosition",
            label: "Recorded Position",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = monitoringPointUpstreamDownstreamCodeTool.execute;
export default monitoringPointUpstreamDownstreamCodeTool;
