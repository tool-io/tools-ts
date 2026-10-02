import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commandedDuration: number;
  readonly openingDelay: number;
  readonly closingOverrun: number;
  readonly openingCredited: boolean;
  readonly closingCredited: boolean;
};
export type Output = {
  readonly effectiveDuration: number;
  readonly netCorrection: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commandedDuration: { type: "number", minimum: 0 },
    openingDelay: { type: "number", minimum: 0 },
    closingOverrun: { type: "number", minimum: 0 },
    openingCredited: { type: "boolean" },
    closingCredited: { type: "boolean" },
  },
  required: [
    "commandedDuration",
    "openingDelay",
    "closingOverrun",
    "openingCredited",
    "closingCredited",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDuration: { type: "number" },
    netCorrection: { type: "number" },
  },
  required: ["effectiveDuration", "netCorrection"],
} as const;
/** Supplied timing ledger under explicit delay-credit flags without issuing equipment commands. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    commandedDuration,
    openingDelay,
    closingOverrun,
    openingCredited,
    closingCredited,
  } = request;
  const compute = (): Output => {
    H.domain(
      commandedDuration >= 0 &&
        openingDelay >= 0 &&
        openingDelay <= commandedDuration &&
        closingOverrun >= 0,
    );
    return {
      effectiveDuration:
        commandedDuration -
        (openingCredited ? openingDelay : 0) +
        (closingCredited ? closingOverrun : 0),
      netCorrection:
        -(openingCredited ? openingDelay : 0) +
        (closingCredited ? closingOverrun : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    commandedDuration: 10,
    openingDelay: 2,
    closingOverrun: 1,
    openingCredited: true,
    closingCredited: true,
  },
  output: { effectiveDuration: 9, netCorrection: -1 },
} satisfies ToolExample<Input, Output>;
export const sectionControlOpenCloseCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/section-control-open-close-credit",
    title: "Section Control Open Close Credit Tool",
    description:
      "Supplied timing ledger under explicit delay-credit flags without issuing equipment commands.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commandedDuration: { type: "number", minimum: 0 },
        openingDelay: { type: "number", minimum: 0 },
        closingOverrun: { type: "number", minimum: 0 },
        openingCredited: { type: "boolean" },
        closingCredited: { type: "boolean" },
      },
      required: [
        "commandedDuration",
        "openingDelay",
        "closingOverrun",
        "openingCredited",
        "closingCredited",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveDuration: { type: "number" },
        netCorrection: { type: "number" },
      },
      required: ["effectiveDuration", "netCorrection"],
    },
    ports: {
      inputs: [
        {
          id: "commandedDuration",
          label: "Commanded Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingDelay",
          label: "Opening Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closingOverrun",
          label: "Closing Overrun",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingCredited",
          label: "Opening Credited",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "closingCredited",
          label: "Closing Credited",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveDuration",
          label: "Effective Duration",
          valueType: { type: "number" },
        },
        {
          id: "netCorrection",
          label: "Net Correction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sectionControlOpenCloseCreditTool.execute;
export default sectionControlOpenCloseCreditTool;
