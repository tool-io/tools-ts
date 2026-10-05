import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstName: string;
  readonly ancestorName: string;
  readonly connector: string;
};
export type Output = { readonly displayName: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstName: { type: "string", maxLength: 8192 },
    ancestorName: { type: "string", maxLength: 8192 },
    connector: {
      type: "string",
      maxLength: 8192,
      enum: ["ibn", "bin", "bint", "بن", "بنت"],
    },
  },
  required: ["firstName", "ancestorName", "connector"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayName: { type: "string", maxLength: 8192 } },
  required: ["displayName"],
} as const;
/** Assemble caller-supplied name components and an explicit connective without inferring lineage, gender or identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstName, ancestorName, connector } = request;
  const compute = (): Output => {
    H.domain(firstName.length > 0 && ancestorName.length > 0, "firstName");
    H.domain(
      ["ibn", "bin", "bint", "بن", "بنت"].includes(connector),
      "connector",
    );
    return { displayName: firstName + " " + connector + " " + ancestorName };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstName: "Ali", ancestorName: "Hasan", connector: "ibn" },
  output: { displayName: "Ali ibn Hasan" },
} satisfies ToolExample<Input, Output>;
export const arabicPersonNameIbnSeparatorDisplayTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "middle-eastern-studies/arabic-person-name-ibn-separator-display",
      title: "Arabic Person Name Ibn Separator Display Tool",
      description:
        "Assemble caller-supplied name components and an explicit connective without inferring lineage, gender or identity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstName: { type: "string", maxLength: 8192 },
          ancestorName: { type: "string", maxLength: 8192 },
          connector: {
            type: "string",
            maxLength: 8192,
            enum: ["ibn", "bin", "bint", "بن", "بنت"],
          },
        },
        required: ["firstName", "ancestorName", "connector"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { displayName: { type: "string", maxLength: 8192 } },
        required: ["displayName"],
      },
      ports: {
        inputs: [
          {
            id: "firstName",
            label: "First Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "ancestorName",
            label: "Ancestor Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "connector",
            label: "Connector",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "displayName",
            label: "Display Name",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = arabicPersonNameIbnSeparatorDisplayTool.execute;
export default arabicPersonNameIbnSeparatorDisplayTool;
