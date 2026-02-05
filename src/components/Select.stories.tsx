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

const SelectWrapper = (args: React.ComponentProps<typeof Select>) => {
  const [value, setValue] = useState<string | string[]>(
    args.multiple ? [] : "",
  );

  useEffect(() => {
    setValue(args.multiple ? [] : "");
  }, [args.multiple]);

  return <Select {...args} value={value} onChange={setValue} />;
};

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
