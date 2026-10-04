import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourcePort: string;
  readonly destinationPort: number;
  readonly schemeDefaultPort: number;
  readonly destinationPortExplicit: boolean;
};
export type Output = { readonly portMatches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourcePort: { type: "string", maxLength: 8192 },
    destinationPort: { type: "integer", minimum: 0, maximum: 65535 },
    schemeDefaultPort: { type: "integer", minimum: 0, maximum: 65535 },
    destinationPortExplicit: { type: "boolean" },
  },
  required: [
    "sourcePort",
    "destinationPort",
    "schemeDefaultPort",
    "destinationPortExplicit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { portMatches: { type: "boolean" } },
  required: ["portMatches"],
} as const;
/** Compare a CSP port selector with an explicit or default destination port; scheme, host and path matching are separate operations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourcePort,
    destinationPort,
    schemeDefaultPort,
    destinationPortExplicit,
  } = request;
  const compute = (): Output => {
    H.integer(destinationPort, 0, 65535);
    H.integer(schemeDefaultPort, 0, 65535);
    H.domain(
      sourcePort === "*" ||
        sourcePort === "" ||
        (/^\d+(?![\s\S])/.test(sourcePort) && Number(sourcePort) <= 65535),
      "sourcePort",
    );
    return {
      portMatches:
        sourcePort === "*" || sourcePort === ""
          ? !destinationPortExplicit || sourcePort === "*"
          : Number(sourcePort) ===
            (destinationPortExplicit ? destinationPort : schemeDefaultPort),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourcePort: "*",
    destinationPort: 8443,
    schemeDefaultPort: 443,
    destinationPortExplicit: true,
  },
  output: { portMatches: true },
} satisfies ToolExample<Input, Output>;
export const cspWildcardPortDomainFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/csp-wildcard-port-domain-flag",
    title: "CSP Wildcard Port Domain Flag Tool",
    description:
      "Compare a CSP port selector with an explicit or default destination port; scheme, host and path matching are separate operations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourcePort: { type: "string", maxLength: 8192 },
        destinationPort: { type: "integer", minimum: 0, maximum: 65535 },
        schemeDefaultPort: { type: "integer", minimum: 0, maximum: 65535 },
        destinationPortExplicit: { type: "boolean" },
      },
      required: [
        "sourcePort",
        "destinationPort",
        "schemeDefaultPort",
        "destinationPortExplicit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { portMatches: { type: "boolean" } },
      required: ["portMatches"],
    },
    ports: {
      inputs: [
        {
          id: "sourcePort",
          label: "Source Port",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "destinationPort",
          label: "Destination Port",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "schemeDefaultPort",
          label: "Scheme Default Port",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "destinationPortExplicit",
          label: "Destination Port Explicit",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "portMatches",
          label: "Port Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cspWildcardPortDomainFlagTool.execute;
export default cspWildcardPortDomainFlagTool;
