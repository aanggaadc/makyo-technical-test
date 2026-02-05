# Select Component

Reusable **Select / Multi-Select** React component with optional search and automatic portal behavior for overflow containers.

---

## Features

- Single select & multi select
- Optional search with highlight
- Automatically uses `createPortal` when inside overflow containers
- Auto reposition on scroll & resize
- TailwindCSS friendly

---

## Basic Usage (Single Select)

```tsx
import { useState } from "react";
import { Select } from "@/components/Select";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
];

export default function Example() {
  const [value, setValue] = useState<string>("");

  return (
    <Select
      label="Fruit"
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Select fruit"
    />
  );
}
```

---

## Multi Select Usage

```tsx
import { useState } from "react";
import { Select } from "@/components/Select";

export default function Example() {
  const [values, setValues] = useState<string[]>([]);

  return (
    <Select
      label="Fruits"
      options={options}
      value={values}
      onChange={setValues}
      multiple
      placeholder="Select fruits"
    />
  );
}
```

---

## With Search

Enable search inside dropdown:

```tsx
<Select
  label="Fruits"
  options={options}
  value={value}
  onChange={setValue}
  withSearch
  placeholder="Search fruit"
/>
```

Search will:
- Filter visually
- Highlight matching text

---

## Props

| Prop         | Type                     | Default | Description |
|--------------|--------------------------|---------|-------------|
| `label`      | `string`                 | `label` | Label displayed on the left |
| `options`    | `{ label, value }[]`     | —       | Select options |
| `value`      | `string \| string[]`    | —       | Selected value(s) |
| `onChange`   | `(value) => void`        | —       | Change handler |
| `multiple`   | `boolean`                | `false` | Enable multi-select |
| `withSearch` | `boolean`                | `false` | Enable search input |
| `placeholder`| `string`                 | `""`    | Placeholder text |

---

## Notes

- When placed inside containers with `overflow: auto | hidden | scroll`, the dropdown automatically renders via **React Portal** to `document.body`.
- Dropdown position updates on **scroll** and **resize**.
- Z-index is set to `2147483647` to avoid clipping issues.

---

## Storybook

This component is documented and testable via **Storybook**.

### Story Setup

```ts
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  argTypes: {
    multiple: { control: "boolean" },
    withSearch: { control: "boolean" },
    placeholder: { control: "text" },
    label: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;
```

### Controlled Wrapper (Recommended)

Because `Select` is a controlled component, it is recommended to wrap it with local state in Storybook:

```tsx
const SelectWrapper = (args: React.ComponentProps<typeof Select>) => {
  const [value, setValue] = useState<string | string[]>(
    args.multiple ? [] : "",
  );

  useEffect(() => {
    setValue(args.multiple ? [] : "");
  }, [args.multiple]);

  return <Select {...args} value={value} onChange={setValue} />;
};
```

### Example Story

```tsx
export const SelectDropdownField: Story = {
  args: {
    multiple: true,
    withSearch: true,
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option with icon", value: "2" },
      { label: "Long Long Option 3", value: "3" },
      { label: "Long Long Long Option 4", value: "4" },
      { label: "Long Long Long Long Option 5", value: "5" },
    ],
  },
  render: (args) => <SelectWrapper {...args} />,
};
```

This setup allows you to:
- Toggle `multiple` and `withSearch` dynamically
- Test controlled behavior correctly
- Preview long option lists & overflow behavior

---

## Styling

This component uses Tailwind CSS utility classes.
