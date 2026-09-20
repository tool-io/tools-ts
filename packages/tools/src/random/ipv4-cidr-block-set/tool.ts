import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  generatorSampleIndices,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateIpv4Cidr } from "../../network/ipv4-cidr/tool.js";
import { calculateIpv4NetworkAddress } from "../../network/ipv4-network-address/tool.js";
import { calculateIpv4BroadcastAddress } from "../../network/ipv4-broadcast-address/tool.js";
import { runPrefixToNetmask } from "../../network/prefix-to-netmask/tool.js";
import { runIpv4ToInteger } from "../../network/ipv4-to-integer/tool.js";
import { runIntegerToIpv4 } from "../../network/integer-to-ipv4/tool.js";

export type Ipv4CidrBlockSetInput = {
  readonly parentAddress: string;
  readonly parentPrefix: number;
  readonly childPrefix: number;
  readonly count: number;
  readonly nonOverlap: boolean;
  readonly seed?: number;
};
export type Ipv4CidrBlockSetOutput = {
  readonly parentCidr: string;
  readonly availableBlockCount: number;
  readonly blocks: readonly {
    readonly index: number;
    readonly cidr: string;
    readonly networkAddress: string;
    readonly broadcastAddress: string;
    readonly addressCount: number;
  }[];
  readonly randomness: GeneratorReplay;
};
const address = {
  type: "string",
  minLength: 7,
  maxLength: 15,
  pattern: "^[0-9.]+(?![\\s\\S])",
} as const;
const prefix = { type: "integer", minimum: 0, maximum: 32 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentAddress: address,
    parentPrefix: prefix,
    childPrefix: prefix,
    count: { type: "integer", minimum: 1, maximum: 256 },
    nonOverlap: { type: "boolean" },
    seed: generatorSeedSchema,
  },
  required: [
    "parentAddress",
    "parentPrefix",
    "childPrefix",
    "count",
    "nonOverlap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentCidr: { type: "string", minLength: 9, maxLength: 18 },
    availableBlockCount: { type: "integer", minimum: 1, maximum: 4294967296 },
    blocks: {
      type: "array",
      minItems: 1,
      maxItems: 256,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: { type: "integer", minimum: 0, maximum: 4294967295 },
          cidr: { type: "string", minLength: 9, maxLength: 18 },
          networkAddress: address,
          broadcastAddress: address,
          addressCount: { type: "integer", minimum: 1, maximum: 4294967296 },
        },
        required: [
          "index",
          "cidr",
          "networkAddress",
          "broadcastAddress",
          "addressCount",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["parentCidr", "availableBlockCount", "blocks", "randomness"],
} as const;

const isInput = (input: unknown): input is Ipv4CidrBlockSetInput =>
  matchesModelInput(input, inputSchema);
export const calculateIpv4CidrBlockSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Ipv4CidrBlockSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.childPrefix < input.parentPrefix)
      simpleError(
        "childPrefix",
        "Child prefixes must be at least as specific as the parent.",
        "child_outside_parent",
      );
    const parent = calculateIpv4Cidr({
      address: input.parentAddress,
      prefix: input.parentPrefix,
    });
    if (!parent.ok)
      return simpleError(
        "parentAddress",
        "Enter a valid IPv4 parent address and prefix.",
        "invalid_parent_cidr",
      );
    const availableBlockCount = 2 ** (input.childPrefix - input.parentPrefix),
      addressCount = 2 ** (32 - input.childPrefix);
    if (input.nonOverlap && input.count > availableBlockCount)
      simpleError(
        "count",
        "The non-overlapping count exceeds available aligned child blocks.",
        "insufficient_child_blocks",
      );
    const parentInteger = runIpv4ToInteger({
        address: parent.output.networkAddress,
      }),
      mask = runPrefixToNetmask({ prefix: input.childPrefix });
    if (!parentInteger.ok || !mask.ok)
      throw new Error("Validated IPv4 parent/mask was rejected by conversion.");
    const random = createGeneratorRandom(input.seed, context);
    const indices = input.nonOverlap
      ? generatorSampleIndices(availableBlockCount, input.count, random)
      : Array.from({ length: input.count }, () =>
          random.integer(0, availableBlockCount - 1),
        );
    const blocks = indices.map((index) => {
      const numericAddress =
          parentInteger.output.integer + index * addressCount,
        formatted = runIntegerToIpv4({ integer: numericAddress });
      if (!formatted.ok)
        throw new Error(
          "Sampled child address is outside its validated IPv4 parent.",
        );
      const networkAddress = calculateIpv4NetworkAddress({
        ipAddress: formatted.output.address,
        subnetMask: mask.output.netmask,
      }).networkAddress;
      const broadcastAddress = calculateIpv4BroadcastAddress({
        ipAddress: formatted.output.address,
        subnetMask: mask.output.netmask,
      }).broadcastAddress;
      if (networkAddress !== formatted.output.address)
        throw new Error("A generated child address is not prefix-aligned.");
      return {
        index,
        cidr: networkAddress + "/" + input.childPrefix,
        networkAddress,
        broadcastAddress,
        addressCount,
      };
    });
    return toolSuccess({
      parentCidr: parent.output.networkAddress + "/" + input.parentPrefix,
      availableBlockCount,
      blocks,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const ipv4CidrBlockSetExample = {
  input: {
    parentAddress: "192.0.2.77",
    parentPrefix: 24,
    childPrefix: 26,
    count: 3,
    nonOverlap: true,
    seed: 42,
  },
  output: {
    parentCidr: "192.0.2.0/24",
    availableBlockCount: 4,
    blocks: [
      {
        index: 2,
        cidr: "192.0.2.128/26",
        networkAddress: "192.0.2.128",
        broadcastAddress: "192.0.2.191",
        addressCount: 64,
      },
      {
        index: 1,
        cidr: "192.0.2.64/26",
        networkAddress: "192.0.2.64",
        broadcastAddress: "192.0.2.127",
        addressCount: 64,
      },
      {
        index: 3,
        cidr: "192.0.2.192/26",
        networkAddress: "192.0.2.192",
        broadcastAddress: "192.0.2.255",
        addressCount: 64,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<Ipv4CidrBlockSetInput, Ipv4CidrBlockSetOutput>;
export const ipv4CidrBlockSetTool = createModelDefinition<
  Ipv4CidrBlockSetInput,
  Ipv4CidrBlockSetOutput
>({
  id: "random/ipv4-cidr-block-set",
  title: "Random IPv4 CIDR Block Set Generator",
  description:
    "Generate aligned equal-prefix child blocks within an explicit normalized IPv4 parent, delegating masks/network/broadcast answers and using bounded-memory index sampling; non-overlap samples without replacement, otherwise duplicate blocks are allowed, with no address allocation or routing action.",
  inputSchema,
  outputSchema,
  execute: calculateIpv4CidrBlockSet,
});
export const runIpv4CidrBlockSet = ipv4CidrBlockSetTool.execute;
export default ipv4CidrBlockSetTool;
