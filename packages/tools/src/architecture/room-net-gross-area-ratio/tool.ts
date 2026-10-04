import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly netArea: number; readonly grossArea: number };
export type Output = {
  readonly netToGross: number;
  readonly grossingFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netArea: { type: "number", exclusiveMinimum: 0 },
    grossArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["netArea", "grossArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netToGross: { type: "number" },
    grossingFactor: { type: "number" },
  },
  required: ["netToGross", "grossingFactor"],
} as const;
/** Return room net-to-gross area and its reciprocal using explicitly comparable measured area boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { netArea, grossArea } = request;
  const compute = (): Output => {
    (H.domain(netArea > 0, "netArea"), netArea);
    (H.domain(grossArea > 0, "grossArea"), grossArea);
    H.domain(netArea <= grossArea, "netArea");
    return {
      netToGross: netArea / grossArea,
      grossingFactor: grossArea / netArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { netArea: 80, grossArea: 100 },
  output: { netToGross: 0.8, grossingFactor: 1.25 },
} satisfies ToolExample<Input, Output>;
export const roomNetGrossAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/room-net-gross-area-ratio",
    title: "Room Net Gross Area Ratio Tool",
    description:
      "Return room net-to-gross area and its reciprocal using explicitly comparable measured area boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netArea: { type: "number", exclusiveMinimum: 0 },
        grossArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["netArea", "grossArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netToGross: { type: "number" },
        grossingFactor: { type: "number" },
      },
      required: ["netToGross", "grossingFactor"],
    },
    ports: {
      inputs: [
        {
          id: "netArea",
          label: "Net Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netToGross",
          label: "Net To Gross",
          valueType: { type: "number" },
        },
        {
          id: "grossingFactor",
          label: "Grossing Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = roomNetGrossAreaRatioTool.execute;
export default roomNetGrossAreaRatioTool;
