"use client";

import * as React from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField as RHFFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
};

export default function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: Props<TFieldValues>) {
  return (
    <RHFFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className="input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

