import { ChangeEvent, ReactNode, useCallback } from 'react';

export interface CommonInputProps<T = string> {
  value: T;
  onChange: (newValue: T) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
}

type InputBaseProps<T> = CommonInputProps<T> & {
  error?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export const InputBase = <
  T extends { toString: () => string } | undefined = string
>({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  prefix,
  suffix,
}: InputBaseProps<T>) => {
  let modifier = '';
  if (error) {
    modifier = 'border-error';
  } else if (disabled) {
    modifier = 'border-disabled bg-base-300';
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value as unknown as T);
    },
    [onChange]
  );

  return (
    <div
      className={`border-base-300 bg-base-200 text-accent flex border-2 ${modifier}`}
    >
      {prefix}
      <input
        className="input input-ghost min-h-6 placeholder:text-accent/50 h-6 w-full border px-2 text-xs text-gray-400 focus:bg-transparent focus:text-gray-400 focus:outline-none"
        // className="input input-ghost placeholder:text-accent/50 h-[2.2rem] min-h-[2.2rem] w-full border px-4 font-medium text-gray-400 focus:bg-transparent focus:text-gray-400 focus:outline-none"
        placeholder={placeholder}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
      />
      {suffix}
    </div>
  );
};
