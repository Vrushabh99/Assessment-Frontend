// components/PromptInput.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import { Wrapper, ActionWrapper } from "./styles";
import { Button } from "../Button";

interface PromptInputProps {
  prompt: string;
  onChange: (value: string) => void;
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Enter your prompt...",
  disabled = false,
}) => {

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <Wrapper>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        minRows={4}
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading || disabled}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "white",
            padding: "10px 10px 40px 10px",
            "& fieldset": {
              borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
              borderColor: "#667eea",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#667eea",
            },
          },
        }}
      />
     <ActionWrapper>
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
        {prompt.trim() && (
          <Tooltip title="Clear">
            <span>
              <IconButton
                size="small"
                onClick={handleClear}
                disabled={isLoading}
                sx={{
                  color: "#999",
                  "&:hover": { color: "#c33" },
                }}
              >
                <ClearIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}

        <Button
          variant="icon"
          title="Send (Shift+Enter for new line)"
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
                <CircularProgress size={20} sx={{ color: "inherit" }} />
              ) : (
                <SendIcon />
              )}
        </Button>
      </Box>
      </ActionWrapper>
    </Wrapper>
  );
};

export default PromptInput;