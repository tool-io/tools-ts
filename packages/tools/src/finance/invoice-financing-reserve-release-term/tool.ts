import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly face: number;
  readonly advance: number;
  readonly fees: number;
  readonly collected: number;
};
export type Output = {
  readonly reserve: number;
  readonly release: number;
  readonly shortfall: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    face: { type: "number", minimum: 0 },
    advance: { type: "number", minimum: 0 },
    fees: { type: "number", minimum: 0 },
    collected: { type: "number", minimum: 0 },
  },
  required: ["face", "advance", "fees", "collected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reserve: { type: "number" },
    release: { type: "number" },
    shortfall: { type: "number" },
  },
  required: ["reserve", "release", "shortfall"],
} as const;
/** Calculate invoice financing reserve release term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { face, advance, fees, collected } = request;
  const compute = (): Output => {
    H.domain(
      face >= 0 &&
        advance >= 0 &&
        advance <= face &&
        fees >= 0 &&
        collected >= 0,
    );
    const reserve = face - advance,
      net = collected - advance - fees;
    return { reserve, release: Math.max(0, net), shortfall: Math.max(0, -net) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { face: 1000, advance: 800, fees: 25, collected: 1000 },
  output: { reserve: 200, release: 175, shortfall: 0 },
} satisfies ToolExample<Input, Output>;
export const invoiceFinancingReserveReleaseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/invoice-financing-reserve-release-term",
    title: "Invoice Financing Reserve Release Term Tool",
    description:
      "Calculate invoice financing reserve release term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        face: { type: "number", minimum: 0 },
        advance: { type: "number", minimum: 0 },
        fees: { type: "number", minimum: 0 },
        collected: { type: "number", minimum: 0 },
      },
      required: ["face", "advance", "fees", "collected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reserve: { type: "number" },
        release: { type: "number" },
        shortfall: { type: "number" },
      },
      required: ["reserve", "release", "shortfall"],
    },
    ports: {
      inputs: [
        {
          id: "face",
          label: "Face",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "advance",
          label: "Advance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fees",
          label: "Fees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collected",
          label: "Collected",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "reserve", label: "Reserve", valueType: { type: "number" } },
        { id: "release", label: "Release", valueType: { type: "number" } },
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = invoiceFinancingReserveReleaseTermTool.execute;
export default invoiceFinancingReserveReleaseTermTool;
