import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly ninthBit: number;
  readonly transmitterRole: string;
};
export type Output = {
  readonly acknowledged: boolean;
  readonly receiverRole: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ninthBit: { type: "integer", minimum: 0, maximum: 1 },
    transmitterRole: {
      type: "string",
      maxLength: 8192,
      enum: ["controller", "target"],
    },
  },
  required: ["ninthBit", "transmitterRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acknowledged: { type: "boolean" },
    receiverRole: { type: "string", maxLength: 8192 },
  },
  required: ["acknowledged", "receiverRole"],
} as const;
/** Compute i²c acknack ninthbit label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { ninthBit, transmitterRole } = input;
  const compute = (): Output => {
    integer(ninthBit, 0, 1);
    domain(["controller", "target"].includes(transmitterRole));
    return {
      acknowledged: ninthBit === 0,
      receiverRole: transmitterRole === "controller" ? "target" : "controller",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { ninthBit: 0, transmitterRole: "controller" },
  output: { acknowledged: true, receiverRole: "target" },
} satisfies ToolExample<Input, Output>;
export const i2cAcknackNinthbitLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/i2c-acknack-ninthbit-label",
  title: "I²C Acknack Ninthbit Label Tool",
  description:
    "Compute i²c acknack ninthbit label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "ninthBit",
        label: "Ninth Bit",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "transmitterRole",
        label: "Transmitter Role",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "acknowledged",
        label: "Acknowledged",
        valueType: { type: "boolean" },
      },
      {
        id: "receiverRole",
        label: "Receiver Role",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = i2cAcknackNinthbitLabelTool.execute;
export default i2cAcknackNinthbitLabelTool;
