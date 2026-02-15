import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("space-y-4", className)}
      {...props}
    />
  )
}

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "vertical" | "horizontal"
}) {
  return (
    <div
      data-slot="field"
      className={cn(
        orientation === "horizontal"
          ? "flex items-center justify-between gap-3"
          : "grid gap-2",
        "data-[invalid=true]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn("data-[invalid=true]:text-destructive", className)}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

type RhfFieldError = { message?: string } | undefined

function FieldError({
  className,
  errors,
  ...props
}: React.ComponentProps<"p"> & { errors: RhfFieldError[] }) {
  const message = errors.find(Boolean)?.message
  if (!message) return null

  return (
    <p
      data-slot="field-error"
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {message}
    </p>
  )
}

export {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
}

