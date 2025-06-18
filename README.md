# zod-url-search-params

Type-safe URL search parameters using Zod schemas.

## Installation

```bash
npm install zod-url-search-params zod
```

## Quick Start

```typescript
import { z } from "zod/v4";
import { searchParamsObject, toSearchParams } from "zod-url-search-params";

const schema = searchParamsObject({
  query: z.string(),
  page: z.number(),
  limit: z.number().optional(),
  active: z.boolean(),
});

// Parse
const params = schema.parse("?query=hello&page=1&active=true");
// { query: 'hello', page: 1, limit: undefined, active: true }

// Serialize
const urlParams = toSearchParams({ query: "world", page: 2, active: false });
// URLSearchParams { 'query' => 'world', 'page' => '2' }
```

## API

### Creating a Schema

`searchParamsObject()` behaves the same way as `z.object()`. This means as long as you use [supported value types](#supported) you can create the schema in the same way as you are used to from zod.

```typescript
import { z } from "zod/v4";
import { searchParamsObject } from "zod-url-search-params";

const schema = searchParamsObject({
  name: z.string(),
  age: z.number(),
  active: z.boolean().optional(),
});

type InferredType = z.infer<typeof schema>;

const typedObject = schema.parse("name=john&age=25&active=true");
// or
const typedObject = schema.parse(new URLSearchParams("name=john&age=25"));
// or
const typedObject = schema.parse(window.location.search);
```

### <span id="supported">Supported Value Types</span>

These are all the values that `searchParamsObject` accepts.

- [`z.string()`, `z.number()`, `z.bigint()`, `z.boolean()`](https://zod.dev/api#primitives)
- [`z.literal()`](https://zod.dev/api#literals)
- [`z.email()`, `z.url()`, `z.uuid()`, etc.](https://zod.dev/api#string-formats)
- [`z.templateLiteral()`](https://zod.dev/api#template-literals)
- [`.optional()` modifier](https://zod.dev/api#optionals)

If the value is not supported, typescript will let you know that you passed in a value that does not work.

### Serializing to URLSearchParams

`toSearchParams` converts an object to URLSearchParams. When parsed by `searchParamsObject` the same object will be recreated.

```typescript
import { toSearchParams } from "zod-url-search-params";

// create new params:
const params = toSearchParams({
  query: "hello",
  page: 1,
  active: true,
  disabled: false,
  empty: undefined,
});

// or update existing params:
const updatedParams = toSearchParams(
  {
    query: "hello",
    page: 1,
    active: true,
    disabled: false,
    empty: undefined,
  },
  window.location.search,
);
```
