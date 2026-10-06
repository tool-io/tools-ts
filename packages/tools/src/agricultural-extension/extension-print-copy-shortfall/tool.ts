import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedCopies: number;
  readonly availableCopies: number;
};
export type Output = {
  readonly shortfallCopies: number;
  readonly surplusCopies: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedCopies: { type: "integer", minimum: 0 },
    availableCopies: { type: "integer", minimum: 0 },
  },
  required: ["requestedCopies", "availableCopies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfallCopies: { type: "integer" },
    surplusCopies: { type: "integer" },
  },
  required: ["shortfallCopies", "surplusCopies"],
} as const;
/** Compare explicit requested and available print-copy counts, separating shortfall from surplus. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedCopies, availableCopies } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(requestedCopies) &&
        requestedCopies >= 0 &&
        requestedCopies <= Number.MAX_SAFE_INTEGER,
      "requestedCopies",
    ),
      requestedCopies);
    (H.domain(
      Number.isSafeInteger(availableCopies) &&
        availableCopies >= 0 &&
        availableCopies <= Number.MAX_SAFE_INTEGER,
      "availableCopies",
    ),
      availableCopies);
    return {
      shortfallCopies: Math.max(0, requestedCopies - availableCopies),
      surplusCopies: Math.max(0, availableCopies - requestedCopies),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedCopies: 60, availableCopies: 45 },
  output: { shortfallCopies: 15, surplusCopies: 0 },
} satisfies ToolExample<Input, Output>;
export const extensionPrintCopyShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/extension-print-copy-shortfall",
    title: "Extension Print Copy Shortfall",
    description:
      "Compare explicit requested and available print-copy counts, separating shortfall from surplus.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedCopies: { type: "integer", minimum: 0 },
        availableCopies: { type: "integer", minimum: 0 },
      },
      required: ["requestedCopies", "availableCopies"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfallCopies: { type: "integer" },
        surplusCopies: { type: "integer" },
      },
      required: ["shortfallCopies", "surplusCopies"],
    },
    ports: {
      inputs: [
        {
          id: "requestedCopies",
          label: "Requested Copies",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "availableCopies",
          label: "Available Copies",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "shortfallCopies",
          label: "Shortfall Copies",
          valueType: { type: "integer" },
        },
        {
          id: "surplusCopies",
          label: "Surplus Copies",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = extensionPrintCopyShortfallTool.execute;
export default extensionPrintCopyShortfallTool;
