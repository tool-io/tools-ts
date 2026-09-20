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
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateSetCookieSerializer } from "../../http/set-cookie-serializer/tool.js";
import { calculateSetCookieParser } from "../../http/set-cookie-parser/tool.js";
import {
  generatedCookiePools,
  generatedCookiePairSchema,
  checkGeneratedCookiePools,
  type GeneratedCookiePair,
} from "../http-cookie-construction.js";

export type GeneratedSetCookieAttributeName =
  | "Path"
  | "Domain"
  | "Expires"
  | "Max-Age"
  | "SameSite"
  | "Secure"
  | "HttpOnly";
export type SetCookieAttributeNameCase = "original" | "lowercase" | "uppercase";
export type HttpSetCookieAttributeCorpusInput = {
  readonly names: readonly string[];
  readonly values: readonly string[];
  readonly attributePools: readonly {
    readonly name: GeneratedSetCookieAttributeName;
    readonly values: readonly string[];
  }[];
  readonly minimumAttributes: number;
  readonly maximumAttributes: number;
  readonly attributeNameCases: readonly SetCookieAttributeNameCase[];
  readonly caseCount: number;
  readonly seed?: number;
};
export type GeneratedSetCookieAttribute = {
  readonly name: string;
  readonly value: string;
};
export type HttpSetCookieAttributeCorpusOutput = {
  readonly cases: readonly {
    readonly cookie: GeneratedCookiePair;
    readonly nameCase: SetCookieAttributeNameCase;
    readonly attributes: readonly GeneratedSetCookieAttribute[];
    readonly header: string;
    readonly parsed: {
      readonly name: string;
      readonly value: string;
      readonly attributes: readonly GeneratedSetCookieAttribute[];
    };
  }[];
  readonly randomness: GeneratorReplay;
};
const attributeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1, maxLength: 16 },
    value: { type: "string", maxLength: 64 },
  },
  required: ["name", "value"],
} as const;
const attributesSchema = {
  type: "array",
  maxItems: 7,
  items: attributeSchema,
} as const;
const nameCaseSchema = {
  type: "string",
  enum: ["original", "lowercase", "uppercase"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...generatedCookiePools,
    caseCount: { type: "integer", minimum: 1, maximum: 32 },
    attributePools: {
      type: "array",
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: {
            type: "string",
            enum: [
              "Path",
              "Domain",
              "Expires",
              "Max-Age",
              "SameSite",
              "Secure",
              "HttpOnly",
            ],
          },
          values: {
            type: "array",
            minItems: 1,
            maxItems: 8,
            items: { type: "string", maxLength: 64 },
          },
        },
        required: ["name", "values"],
      },
    },
    minimumAttributes: { type: "integer", minimum: 0, maximum: 7 },
    maximumAttributes: { type: "integer", minimum: 0, maximum: 7 },
    attributeNameCases: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: nameCaseSchema,
    },
    seed: generatorSeedSchema,
  },
  required: [
    "names",
    "values",
    "caseCount",
    "attributePools",
    "minimumAttributes",
    "maximumAttributes",
    "attributeNameCases",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          cookie: generatedCookiePairSchema,
          nameCase: nameCaseSchema,
          attributes: attributesSchema,
          header: { type: "string", minLength: 2, maxLength: 1024 },
          parsed: {
            type: "object",
            additionalProperties: false,
            properties: {
              ...generatedCookiePairSchema.properties,
              attributes: attributesSchema,
            },
            required: ["name", "value", "attributes"],
          },
        },
        required: ["cookie", "nameCase", "attributes", "header", "parsed"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;

const isInput = (input: unknown): input is HttpSetCookieAttributeCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpSetCookieAttributeCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpSetCookieAttributeCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      new Set(input.attributeNameCases).size !== input.attributeNameCases.length
    )
      simpleError(
        "attributeNameCases",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    checkGeneratedCookiePools(input.names, input.values);
    if (
      input.minimumAttributes > input.maximumAttributes ||
      input.maximumAttributes > input.attributePools.length
    )
      simpleError(
        "maximumAttributes",
        "Attribute-count bounds must be ordered and fit the supplied pools.",
        "infeasible_attribute_count",
      );
    if (
      new Set(input.attributePools.map((pool) => pool.name)).size !==
      input.attributePools.length
    )
      simpleError(
        "attributePools",
        "Each attribute name may have only one pool.",
        "duplicate_attribute_pool",
      );
    for (const pool of input.attributePools)
      for (const value of pool.values) {
        if (/[^\x20-\x7e]|;/.test(value) || value !== value.trim())
          simpleError(
            "attributePools",
            "Attribute fragments must be trimmed printable ASCII without semicolons or controls.",
            "invalid_attribute_value",
          );
        if (pool.name === "Secure" || pool.name === "HttpOnly") {
          if (value !== "")
            simpleError(
              "attributePools",
              "Flag attributes require empty values.",
              "invalid_flag_value",
            );
        } else if (value === "")
          simpleError(
            "attributePools",
            "Value attributes require nonempty text.",
            "empty_attribute_value",
          );
        if (
          pool.name === "SameSite" &&
          !["Lax", "Strict", "None"].includes(value)
        )
          simpleError(
            "attributePools",
            "SameSite pools support Lax, Strict and None text.",
            "invalid_samesite_value",
          );
        if (pool.name === "Max-Age" && !/^-?[0-9]+(?![\s\S])/.test(value))
          simpleError(
            "attributePools",
            "Max-Age fixtures require a signed integer seconds string.",
            "invalid_max_age",
          );
      }
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.caseCount }, () => {
      const cookie = {
          name: random.pick(input.names),
          value: random.pick(input.values),
        },
        count = random.integer(
          input.minimumAttributes,
          input.maximumAttributes,
        );
      const selected = random
        .shuffle(input.attributePools)
        .slice(0, count)
        .map((pool) => ({ name: pool.name, value: random.pick(pool.values) }));
      const nameCase = random.pick(input.attributeNameCases),
        attributes = selected.map(({ name, value }) => ({
          name:
            nameCase === "uppercase"
              ? name.toUpperCase()
              : nameCase === "lowercase"
                ? name.toLowerCase()
                : name,
          value,
        }));
      const serialized = calculateSetCookieSerializer({
        ...cookie,
        attributes,
      });
      if (!serialized.ok)
        throw new Error(
          "Validated generated Set-Cookie fragments were rejected by the serializer.",
        );
      const parsed = calculateSetCookieParser({
        header: serialized.output.header,
      });
      if (
        !parsed.ok ||
        parsed.output.name !== cookie.name ||
        parsed.output.value !== cookie.value ||
        parsed.output.attributes.length !== attributes.length ||
        parsed.output.attributes.some(
          (attribute, i) =>
            attribute.name !== attributes[i].name.toLowerCase() ||
            attribute.value !== attributes[i].value,
        )
      )
        throw new Error(
          "Generated Set-Cookie attributes failed the delegated ordered round trip.",
        );
      return {
        cookie,
        nameCase,
        attributes,
        header: serialized.output.header,
        parsed: parsed.output,
      };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpSetCookieAttributeCorpusExample = {
  input: {
    names: ["test"],
    values: ["x", "%20"],
    attributePools: [
      {
        name: "Path",
        values: ["/"],
      },
      {
        name: "Expires",
        values: ["Wed, 21 Oct 2037 07:28:00 GMT"],
      },
      {
        name: "Secure",
        values: [""],
      },
    ],
    minimumAttributes: 1,
    maximumAttributes: 3,
    attributeNameCases: ["original", "uppercase"],
    caseCount: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        cookie: {
          name: "test",
          value: "x",
        },
        nameCase: "uppercase",
        attributes: [
          {
            name: "EXPIRES",
            value: "Wed, 21 Oct 2037 07:28:00 GMT",
          },
          {
            name: "PATH",
            value: "/",
          },
          {
            name: "SECURE",
            value: "",
          },
        ],
        header: "test=x; EXPIRES=Wed, 21 Oct 2037 07:28:00 GMT; PATH=/; SECURE",
        parsed: {
          name: "test",
          value: "x",
          attributes: [
            {
              name: "expires",
              value: "Wed, 21 Oct 2037 07:28:00 GMT",
            },
            {
              name: "path",
              value: "/",
            },
            {
              name: "secure",
              value: "",
            },
          ],
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  HttpSetCookieAttributeCorpusInput,
  HttpSetCookieAttributeCorpusOutput
>;
export const httpSetCookieAttributeCorpusTool = createModelDefinition<
  HttpSetCookieAttributeCorpusInput,
  HttpSetCookieAttributeCorpusOutput
>({
  id: "random/http-set-cookie-attribute-corpus",
  title: "Random HTTP Set-Cookie Attribute Corpus Generator",
  description:
    "Compose synthetic Set-Cookie name/value pairs and bounded attribute subsets from supplied value pools, including explicit opaque Expires text, flags, and supported name casing; delegate serializer/parser outputs while preserving attribute order, without dates interpreted, browser acceptance, credentials, or security-policy recommendations.",
  inputSchema,
  outputSchema,
  execute: calculateHttpSetCookieAttributeCorpus,
});
export const runHttpSetCookieAttributeCorpus =
  httpSetCookieAttributeCorpusTool.execute;
export default httpSetCookieAttributeCorpusTool;
