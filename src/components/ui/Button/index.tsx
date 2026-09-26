// components/Button.tsx
import { Button as MuiButton, ButtonProps as MuiButtonProps, Tooltip } from "@mui/material";
import { useTheme } from "styled-components";
import React, { useMemo } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "icon";

interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: ButtonVariant;
  title?: string; // For Icon Only Button
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", title, disabled, children, sx, ...props }, ref) => {
    const theme = useTheme() as any;

    const variantConfig = useMemo(
      () => ({
        primary: {
          backgroundColor: theme.colors.primary,
          color: theme.colors.surface,
          border: `1px solid ${theme.colors.primary}`,
          "&:hover": { backgroundColor: theme.colors.primary, opacity: 0.9 },
        },
        secondary: {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          "&:hover": { backgroundColor: theme.colors.surface, opacity: 0.9 },
        },
        outline: {
          backgroundColor: "transparent",
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          "&:hover": { backgroundColor: theme.colors.surface },
        },
        icon: {
          backgroundColor: "transparent",
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "50%",
          minWidth: "40px",
          minHeight: "40px",
          padding: "8px",
          "&:hover": { backgroundColor: theme.colors.surface },
          svg: { fill: theme.colors.primary },
        },
      }),
      [theme]
    );

    const button = (
      <MuiButton
        ref={ref}
        disabled={disabled}
        aria-label={variant === "icon" ? props["aria-label"] || title : props["aria-label"]}
        {...props}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          borderRadius: "8px",
          fontWeight: 600,
          padding: "8px 10px",
          textTransform: "none",
          fontSize: "1rem",
          transition: "all 0.2s ease",
          "&:focus-visible": {
            outline: `2px solid ${theme.colors.primary}`,
            outlineOffset: "2px",
          },
          ...variantConfig[variant],
          ...sx,
        }}
      >
        {children}
      </MuiButton>
    );

    if (!title) return button;

    return (
      <Tooltip title={title}>
        {disabled ? <span style={{ display: "inline-block" }}>{button}</span> : button}
      </Tooltip>
    );
  }
);

Button.displayName = "Button";