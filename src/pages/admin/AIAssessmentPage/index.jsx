import { Form, GradientDivider, QuestionActionsWrapper, QuestionContainer } from "./styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Paper,
    Grid,
    Snackbar,
    Alert,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PromptInput from "../../../components/ui/PromptInput";
import { DropDown } from "../../../components/ui/DropDown";
import { NumberField } from "../../../components/ui/NumberField";
import { QuestionRenderer } from "../../../components/QuestionRenderer";
import { QuestionForm } from "../../../components/QuestionForm";
import { Button } from "../../../components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAIAssessment, generateAIAssessment } from "../../../api/ai-assessment";
import { TextField } from "../../../components/ui/TextField";
import { CommonLoader } from "../../../components/ui/CommonLoader";
import { DashboardLayout } from "../../../layouts/DashboardLayout";

export const AIAssessmentPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [prompt, setPrompt] = useState("");
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState("draft");
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [EditId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(5);
    const [difficulty, setDifficulty] = useState("medium");
    const [points, setPoints] = useState(1);
    const [snackBar, setSnackBar] = useState(null);

    const handlePromptSubmit = async (prompt) => {
        setIsLoading(true);
        setGeneratedQuestions([]);
        try {
            const data = await generateAIAssessment({ topic: prompt, count, difficulty });
            const formattedQuestions = data.questions.map(q => ({
                ...q,
                difficulty,
                status: "published",
                points,
            }));
            setGeneratedQuestions(formattedQuestions);
        } catch (error) {
            console.error("Error:", error);
            setSnackBar({ open: true, message: "Error generating questions. Try Again !!", severity: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setPrompt("");
        setGeneratedQuestions([]);
        setTitle('');
        setStatus("draft");
        setEditId(null);
        setIsLoading(false);
        setCount(5);
        setDifficulty("medium");
        setPoints(1);
    };

    const handleEditQuestion = (index) => {
        setEditId(index);
    }

    const handleDeleteQuestion = (index) => {
        setGeneratedQuestions((prevQuestions) =>
            prevQuestions.filter((_, i) => i !== index)
        );
        setSnackBar({ open: true, message: "Question deleted successfully", severity: "info" });
    };

    const ActionButtons = ({ index }) => (
        <QuestionActionsWrapper className={EditId !== null ? "" : "actionsWrapper"}>
            <Button onClick={() => handleEditQuestion(index)} variant="icon" title="Edit"><EditIcon /></Button>
            <Button onClick={() => handleDeleteQuestion(index)} variant="icon" title="Delete"><DeleteIcon /></Button>
        </QuestionActionsWrapper>
    );

    const onQuestionSave = (index, values) => {
        setGeneratedQuestions((prevQuestions) =>
            prevQuestions.map((question, i) => (i === index ? { ...question, ...values } : question))
        );
        setEditId(null);
        setSnackBar({ open: true, message: "Question saved successfully !!", severity: "success" });
    };

    const saveMutation = useMutation({
        mutationFn: () => createAIAssessment({
            questions: generatedQuestions,
            title,
            status,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries("assessments");
            setSnackBar({ open: true, message: "Assessment saved successfully !!", severity: "success" });
            setTimeout(() => {
                navigate("/admin/assessments");
            }, 2000);
        },
        onError: (error) => {
            setSnackBar({ open: true, message: `Error: ${error.message}`, severity: "error" });
        },
    })

    const handleSave = async (e) => {
        e.preventDefault();
        await saveMutation.mutateAsync()
    }

    return (
        <DashboardLayout title="Admin workspace" role="Administrator" hideNavigation>
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ borderRadius: "12px", overflow: "hidden", p: 4 }}>
                    <Box sx={{ p: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                        <h1 style={{ margin: 0 }}><AutoAwesomeIcon size={40} /> AI Assessment Generator</h1>
                        <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>
                            Generate mixed question types instantly
                        </p>
                    </Box>

                    <Form onSubmit={handleSave}>
                    {/* Settings */}
                    <Grid item sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <Button
                                color="secondary"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => handleReset()}
                            >
                                Reset
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                Save Assessment
                            </Button>
                    </Grid>
                    <Grid item sx={{ mt: 2 }}>
                        <TextField
                            label="Assessment Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </Grid>
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                        <Grid item xs={12} sm={6}>
                            <DropDown
                                label="Status"
                                options={[{
                                    label: "Draft", value: "draft"
                                }, {
                                    label: "Published", value: "published"
                                }]}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DropDown
                                label="Difficulty"
                                options={[{
                                    label: "Easy", value: "easy"
                                }, {
                                    label: "Medium", value: "medium"
                                }, {
                                    label: "Hard", value: "hard"
                                }]}
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <NumberField
                                label="Number of Questions"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                disabled={isLoading}
                                min={1}
                                max={20}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <NumberField
                                label="Points"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                disabled={isLoading}
                                min={1}
                                max={10}
                                required
                            />
                        </Grid>
                    </Grid>

                    <Grid spacing={2}>
                        <PromptInput
                            prompt={prompt}
                            onChange={setPrompt}
                            onSubmit={handlePromptSubmit}
                            isLoading={isLoading}
                            placeholder="Enter a topic to generate questions for (e.g., Indian History, World War II, Economics)..."
                        />
                    </Grid>
                    <Box
                        sx={{
                            minHeight: "300px",
                            mb: 3,
                            p: 2,
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        {isLoading && <CommonLoader label="Generating questions..." />}
                        {generatedQuestions.map((question, index) => {
                            return (
                                <>
                                <QuestionContainer key={index}>
                                    <ActionButtons index={index} />
                                    {EditId === index ? (
                                        <QuestionForm
                                            question={question}
                                            onCancel={() => setEditId(null)}
                                            onSave={(values) => onQuestionSave(index, values)}
                                        />
                                    ) : (
                                        <QuestionRenderer
                                            question={question}
                                            mode="preview"
                                            showCorrectAnswer
                                        />
                                    )}
                                </QuestionContainer>
                                {index < generatedQuestions.length - 1 && <GradientDivider />}
                                </>
                            );
                        })}
                    </Box>
                </Form>
                </Paper>
            </Box>
            <Snackbar
                open={snackBar?.open}
                autoHideDuration={6000}
                onClose={() => setSnackBar({ open: false, message: '' })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackBar?.severity}>{snackBar?.message}</Alert>
            </Snackbar>
        </Container>
        </DashboardLayout>
    );
}