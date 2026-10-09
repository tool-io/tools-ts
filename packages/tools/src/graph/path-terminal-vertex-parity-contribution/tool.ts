import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vertexId: string;
  readonly firstTerminalId: string;
  readonly lastTerminalId: string;
};
export type Output = {
  readonly endpointOccurrences: number;
  readonly contributesOddDegree: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertexId: { type: "string", maxLength: 8192, minLength: 1 },
    firstTerminalId: { type: "string", maxLength: 8192, minLength: 1 },
    lastTerminalId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["vertexId", "firstTerminalId", "lastTerminalId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endpointOccurrences: { type: "integer" },
    contributesOddDegree: { type: "boolean" },
  },
  required: ["endpointOccurrences", "contributesOddDegree"],
} as const;
/** Count explicit walk-endpoint occurrences and their degree parity contribution, including coincident endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertexId, firstTerminalId, lastTerminalId } = request;
  const compute = (): Output => {
    H.domain(
      vertexId.length > 0 &&
        firstTerminalId.length > 0 &&
        lastTerminalId.length > 0,
      "vertexId",
    );
    return (() => {
      const endpointOccurrences =
        (vertexId === firstTerminalId ? 1 : 0) +
        (vertexId === lastTerminalId ? 1 : 0);
      return {
        endpointOccurrences,
        contributesOddDegree: endpointOccurrences === 1,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vertexId: "V2", firstTerminalId: "V1", lastTerminalId: "V2" },
  output: { endpointOccurrences: 1, contributesOddDegree: true },
} satisfies ToolExample<Input, Output>;
export const pathTerminalVertexParityContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["graph", "mathematics"],
        keywords: ["graph", "mathematics"],
      },
      id: "graph/path-terminal-vertex-parity-contribution",
      title: "Path Terminal Vertex Parity Contribution",
      description:
        "Count explicit walk-endpoint occurrences and their degree parity contribution, including coincident endpoints.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vertexId: { type: "string", maxLength: 8192, minLength: 1 },
          firstTerminalId: { type: "string", maxLength: 8192, minLength: 1 },
          lastTerminalId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["vertexId", "firstTerminalId", "lastTerminalId"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          endpointOccurrences: { type: "integer" },
          contributesOddDegree: { type: "boolean" },
        },
        required: ["endpointOccurrences", "contributesOddDegree"],
      },
      ports: {
        inputs: [
          {
            id: "vertexId",
            label: "Vertex Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstTerminalId",
            label: "First Terminal Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "lastTerminalId",
            label: "Last Terminal Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "endpointOccurrences",
            label: "Endpoint Occurrences",
            valueType: { type: "integer" },
          },
          {
            id: "contributesOddDegree",
            label: "Contributes Odd Degree",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pathTerminalVertexParityContributionTool.execute;
export default pathTerminalVertexParityContributionTool;
