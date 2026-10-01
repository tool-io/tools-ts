import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedBytes: number;
  readonly includesPreambleAndSfd: boolean;
};
export type Output = {
  readonly frameBytes: number;
  readonly wireBytesBeforeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedBytes: { type: "integer", minimum: 0 },
    includesPreambleAndSfd: { type: "boolean" },
  },
  required: ["reportedBytes", "includesPreambleAndSfd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameBytes: { type: "integer" },
    wireBytesBeforeGap: { type: "integer" },
  },
  required: ["frameBytes", "wireBytesBeforeGap"],
} as const;
/** Account for seven preamble octets and one start-frame delimiter; interpacket gap is excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedBytes, includesPreambleAndSfd } = request;
  const compute = (): Output => {
    H.integer(reportedBytes, 0);
    H.domain(!includesPreambleAndSfd || reportedBytes >= 8);
    return {
      frameBytes: reportedBytes - (includesPreambleAndSfd ? 8 : 0),
      wireBytesBeforeGap: reportedBytes + (includesPreambleAndSfd ? 0 : 8),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedBytes: 72, includesPreambleAndSfd: true },
  output: { frameBytes: 64, wireBytesBeforeGap: 72 },
} satisfies ToolExample<Input, Output>;
export const ethernetPreambleIncludedLengthFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ethernet-preamble-included-length-flag",
    title: "Ethernet Preamble Included Length Flag Tool",
    description:
      "Account for seven preamble octets and one start-frame delimiter; interpacket gap is excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedBytes: { type: "integer", minimum: 0 },
        includesPreambleAndSfd: { type: "boolean" },
      },
      required: ["reportedBytes", "includesPreambleAndSfd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameBytes: { type: "integer" },
        wireBytesBeforeGap: { type: "integer" },
      },
      required: ["frameBytes", "wireBytesBeforeGap"],
    },
    ports: {
      inputs: [
        {
          id: "reportedBytes",
          label: "Reported Bytes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includesPreambleAndSfd",
          label: "Includes Preamble And Sfd",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "frameBytes",
          label: "Frame Bytes",
          valueType: { type: "integer" },
        },
        {
          id: "wireBytesBeforeGap",
          label: "Wire Bytes Before Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = ethernetPreambleIncludedLengthFlagTool.execute;
export default ethernetPreambleIncludedLengthFlagTool;
