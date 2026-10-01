import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothWidths: readonly number[];
  readonly availableLength: number;
  readonly extractionWidths: readonly number[];
};
export type Output = {
  readonly requiredLength: number;
  readonly releasedLength: number;
  readonly netRequired: number;
  readonly spaceBalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothWidths: { type: "array", maxItems: 256, items: { type: "number" } },
    availableLength: { type: "number", minimum: 0 },
    extractionWidths: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["toothWidths", "availableLength", "extractionWidths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLength: { type: "number" },
    releasedLength: { type: "number" },
    netRequired: { type: "number" },
    spaceBalance: { type: "number" },
  },
  required: ["requiredLength", "releasedLength", "netRequired", "spaceBalance"],
} as const;
/** Audit supplied model widths and explicitly removed widths without choosing a treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothWidths, availableLength, extractionWidths } = request;
  const compute = (): Output => {
    H.domain(
      toothWidths.every((x) => x >= 0) &&
        extractionWidths.every((x) => x >= 0) &&
        availableLength >= 0 &&
        extractionWidths.reduce((a, b) => a + b, 0) <=
          toothWidths.reduce((a, b) => a + b, 0),
    );
    return {
      requiredLength: toothWidths.reduce((a, b) => a + b, 0),
      releasedLength: extractionWidths.reduce((a, b) => a + b, 0),
      netRequired:
        toothWidths.reduce((a, b) => a + b, 0) -
        extractionWidths.reduce((a, b) => a + b, 0),
      spaceBalance:
        availableLength -
        toothWidths.reduce((a, b) => a + b, 0) +
        extractionWidths.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { toothWidths: [7, 8, 9], availableLength: 22, extractionWidths: [7] },
  output: {
    requiredLength: 24,
    releasedLength: 7,
    netRequired: 17,
    spaceBalance: 5,
  },
} satisfies ToolExample<Input, Output>;
export const archModelToothWidthSpaceBalanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "orthodontics/arch-model-tooth-width-space-balance-term",
      title: "Arch Model Tooth Width Space Balance Term Tool",
      description:
        "Audit supplied model widths and explicitly removed widths without choosing a treatment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          toothWidths: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          availableLength: { type: "number", minimum: 0 },
          extractionWidths: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["toothWidths", "availableLength", "extractionWidths"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredLength: { type: "number" },
          releasedLength: { type: "number" },
          netRequired: { type: "number" },
          spaceBalance: { type: "number" },
        },
        required: [
          "requiredLength",
          "releasedLength",
          "netRequired",
          "spaceBalance",
        ],
      },
      ports: {
        inputs: [
          {
            id: "toothWidths",
            label: "Tooth Widths",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "availableLength",
            label: "Available Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "extractionWidths",
            label: "Extraction Widths",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "requiredLength",
            label: "Required Length",
            valueType: { type: "number" },
          },
          {
            id: "releasedLength",
            label: "Released Length",
            valueType: { type: "number" },
          },
          {
            id: "netRequired",
            label: "Net Required",
            valueType: { type: "number" },
          },
          {
            id: "spaceBalance",
            label: "Space Balance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = archModelToothWidthSpaceBalanceTermTool.execute;
export default archModelToothWidthSpaceBalanceTermTool;
